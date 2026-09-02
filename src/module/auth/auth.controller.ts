import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";

const registerUser = catchAsync(async (req, res) => {
  await authService.registerUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User registered successfully. Please check your email for OTP.",
    data: null,
  });
});

const verifyRegOtp = catchAsync(async (req, res) => {
  const user = await authService.verifyRegOtp(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User verified successfully.",
    data: user,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const result = await authService.forgetPassword(req.body.email);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset email sent successfully.",
    data: null,
  });
});
const verifyForgetPasswordOtp = catchAsync(async (req, res) => {
  const result = await authService.verifyForgetPasswordOtp(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset successfully.",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await authService.loginUser(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "production",
    sameSite: "none",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully.",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const userInfo = await authService.getMe(req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User info retrieved successfully.",
    data: userInfo,
  });
});

export const authController = {
  registerUser,
  verifyRegOtp,
  forgetPassword,
  verifyForgetPasswordOtp,
  loginUser,
  getMe,
};
