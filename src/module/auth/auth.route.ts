import { Router } from "express";
import { dataValidationZod } from "../../middleware/validation";
import { authController } from "./auth.controller";
import {
  ForgetPasswordVerifyOtpZod,
  ForgetPasswordZod,
  RegisterUserZod,
  VerifyRegOtpZod,
} from "./auth.validation";

const router = Router();

router.post(
  "/register",
  dataValidationZod(RegisterUserZod),
  authController.registerUser,
);
router.post(
  "/verify-register",
  dataValidationZod(VerifyRegOtpZod),
  authController.verifyRegOtp,
);
router.post(
  "/forget-password",
  dataValidationZod(ForgetPasswordZod),
  authController.forgetPassword,
);
router.post(
  "/verify-forget-password-otp",
  dataValidationZod(ForgetPasswordVerifyOtpZod),
  authController.verifyForgetPasswordOtp,
);

export const AuthRoute = router;
