import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { Role } from "../../../prisma/src/generated/prisma/enums";
import { redisClient } from "../../config/redis";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { IRegisterMentor, IVerifyMentor } from "./mentor.interface";

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

  // const uploadedDocument = await r2

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      role: Role.MENTOR,
      emailVerified: true,
      mentor: {},
    },
  });

  await redisClient.del(userKey);
  await redisClient.del(otpKey);

  return user;
};

export const mentorService = {
  registerMentor,
  verifyMentor,
};
