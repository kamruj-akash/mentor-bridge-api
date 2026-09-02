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

export const authController = {
  registerUser,
  verifyRegOtp,
  forgetPassword,
  verifyForgetPasswordOtp,
};
