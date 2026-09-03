import bcrypt from "bcryptjs";
import type { UploadApiResponse } from "cloudinary";
import httpStatus from "http-status";
import {
  MentorVerificationStatus,
  Role,
} from "../../../prisma/src/generated/prisma/enums";
import { redisClient } from "../../config/redis";
import cloudinary from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import type { RequestUser } from "../../middleware/authCheck";
import { AppError } from "../../utils/AppError";
import type {
  IApproveMentor,
  IRegisterMentor,
  IVerifyMentor,
} from "./mentor.interface";

const generateOtp = Math.floor(100000 + Math.random() * 900000).toString();

const registerMentor = async (payload: IRegisterMentor) => {
  const { name, email, password: payloadPass } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User already exists, user another email!",
    );
  }
  const userKey = `mentorRegister:${email}`;
  const otpKey = `mentorRegisterOtp:${email}`;
  const storedUser = await redisClient.set(
    userKey,
    JSON.stringify({
      name,
      email,
      password: await bcrypt.hash(payloadPass, 10),
    }),
    {
      EX: 60 * 60,
    },
  );
  const storedOtp = await redisClient.set(otpKey, generateOtp, {
    EX: 60 * 60,
  });
  if (!storedOtp && !storedUser) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to store OTP in Redis",
    );
  }
  return;
};

const verifyMentor = async (
  payload: IVerifyMentor,
  documents: Express.Multer.File[],
) => {
  const { email: otpEmail, otp } = payload;
  const userKey = `mentorRegister:${otpEmail}`;
  const otpKey = `mentorRegisterOtp:${otpEmail}`;
  const storedUser = await redisClient.get(userKey);
  const storedOtp = await redisClient.get(otpKey);

  if (!storedUser || !storedOtp) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "OTP expired or user not found, please register again",
    );
  }

  if (storedOtp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  const { name, email, password } = JSON.parse(storedUser);
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User already exists, user another email!",
    );
  }

  const uploadedDocument = await Promise.all(
    documents.map((document) => {
      return new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
              folder: "mentor-documents",
            },
            async (error, result) => {
              if (error) {
                return reject(error);
              }
              if (!result) {
                throw new AppError(
                  httpStatus.INTERNAL_SERVER_ERROR,
                  "Failed to upload document",
                );
              }
              resolve(result);
            },
          )
          .end(document.buffer);
      });
    }),
  );

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      role: Role.MENTOR,
      emailVerified: true,
      mentor: {
        create: {
          documents: uploadedDocument.map((doc) => ({
            url: doc.secure_url,
            publicId: doc.public_id,
          })),
          department: payload.department,
          hourlyRate: payload.hourlyRate,
          university: payload.university,
          isVerified: false,
          verificationStatus: MentorVerificationStatus.PENDING,
          bio: payload?.bio || null,
        },
      },
    },
    omit: {
      password: true,
    },
    include: {
      mentor: true,
    },
  });

  await redisClient.del(userKey);
  await redisClient.del(otpKey);

  return user;
};

const approveMentor = async (payload: IApproveMentor, user: RequestUser) => {
  let { mentorId, status, reason } = payload;
  status = status.toUpperCase();
  if (!status || !mentorId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Mentor ID and status are required",
    );
  }
  if (user.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to approve mentor",
    );
  }

  if (
    status !== MentorVerificationStatus.APPROVE &&
    status !== MentorVerificationStatus.REJECT
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid status, must be either APPROVE or REJECT",
    );
  }
  const isMentorExist = await prisma.mentor.findUnique({
    where: { id: mentorId },
  });

  if (!isMentorExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Mentor not found");
  }
  if (isMentorExist.verificationStatus !== MentorVerificationStatus.PENDING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Mentor is already verified or rejected",
    );
  }

  if (status === MentorVerificationStatus.REJECT && !reason) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Reason is required when rejecting a mentor",
    );
  }

  if (status === MentorVerificationStatus.REJECT) {
    const updatedMentor = await prisma.mentor.update({
      where: { id: mentorId },
      data: {
        isVerified: false,
        verificationStatus: MentorVerificationStatus.REJECT,
        rejectionReason: reason || "No reason provided",
      },
    });
    return updatedMentor;
  }

  if (status === MentorVerificationStatus.APPROVE) {
    const updatedMentor = await prisma.mentor.update({
      where: { id: mentorId },
      data: {
        isVerified: true,
        verificationStatus: MentorVerificationStatus.APPROVE,
      },
    });
    return updatedMentor;
  }
};

export const mentorService = {
  registerMentor,
  verifyMentor,
  approveMentor,
};
