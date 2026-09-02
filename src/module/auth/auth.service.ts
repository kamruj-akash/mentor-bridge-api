import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { Role } from "../../../prisma/src/generated/prisma/enums";
import envConfig from "../../config/env";
import { redisClient } from "../../config/redis";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type {
  IForgetPasswordVerifyOtp,
  IRegisterUser,
  IVerifyRegOtp,
} from "./auth.interface";

const generateOtp = Math.floor(100000 + Math.random() * 900000).toString();

const registerUser = async (payload: IRegisterUser) => {
  const { name, email, password, role } = payload;
  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExists) {
    if (isUserExists.authProvider === "GOOGLE") {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "User already exists with Google login, please login with Google and set a password to login with email and password",
      );
    }
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User already exists, please login",
    );
  }
  const storedUser = await redisClient.set(
    `newUser:${email}`,
    JSON.stringify({
      name,
      email,
      password: await bcrypt.hash(
        password,
        Number(envConfig.bcrypt_salt_rounds),
      ),
      role,
    }),
    { EX: 3600 },
  );
  const storedOtp = await redisClient.set(`registerOtp:${email}`, generateOtp, {
    EX: 3600,
  });
  if (!storedUser || !storedOtp) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong, please try again",
    );
  }

  return;
};

const verifyRegOtp = async (payload: IVerifyRegOtp) => {
  const { email, otp } = payload;
  const storedOtp = await redisClient.get(`registerOtp:${email}`);
  if (!storedOtp) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "OTP has expired, please try again",
    );
  }
  if (storedOtp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP, please try again");
  }
  const userData = await redisClient.get(`newUser:${email}`);
  if (!userData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User data has expired, please try again",
    );
  }
  const { name, password } = JSON.parse(userData);
  const registerUser = await prisma.user.create({
    data: {
      email,
      name,
      password,
      emailVerified: true,
      role: Role.STUDENT,
      student: {
        create: {
          institution: "",
          targetExam: "",
        },
      },
    },
    omit: {
      password: true,
    },
    include: {
      student: true,
    },
  });
  await redisClient.del(`newUser:${email}`);
  await redisClient.del(`registerOtp:${email}`);
  return registerUser;
};

const forgetPassword = async (email: string) => {
  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });

  if (!isUserExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User does not exist, please register",
    );
  }
  const storedOtp = await redisClient.set(
    `forgetPasswordOtp:${email}`,
    generateOtp,
    {
      EX: 300,
    },
  );
  if (!storedOtp) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Something went wrong, please try again",
    );
  }
  return;
};

const verifyForgetPasswordOtp = async (payload: IForgetPasswordVerifyOtp) => {
  const { email, newPassword, otp } = payload;
  const storedOtp = await redisClient.get(`forgetPasswordOtp:${payload.email}`);
  if (!storedOtp) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "OTP has expired, please try again",
    );
  }
  if (storedOtp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP, please try again");
  }
  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      password: await bcrypt.hash(
        newPassword,
        Number(envConfig.bcrypt_salt_rounds),
      ),
    },
    omit: { password: true },
  });
  await redisClient.del(`forgetPasswordOtp:${payload.email}`);

  return updatedUser;
};

export const authService = {
  registerUser,
  verifyRegOtp,
  forgetPassword,
  verifyForgetPasswordOtp,
};
