import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { mentorService } from "./mentor.service";

const registerMentor = catchAsync(async (req, res) => {
  await mentorService.registerMentor(req.body);
  //   res.redirect("/mentor/verify-otp");
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Mentor registered successfully, please check your email for OTP",
    data: null,
  });
});

const verifyMentor = catchAsync(async (req, res) => {
  const documents = req.file;
  const result = await mentorService.verifyMentor(req.body, documents);
});

export const mentorController = { registerMentor };
