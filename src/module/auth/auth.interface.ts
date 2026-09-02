import type { Role } from "../../../prisma/src/generated/prisma/enums";

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface IVerifyRegOtp {
  email: string;
  otp: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IGLogin {
  idToken: string;
}

export interface IForgetPasswordVerifyOtp {
  email: string;
  newPassword: string;
  otp: string;
}
