import httpStatus from "http-status";
import type { RequestUser } from "../../middleware/authCheck";
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
  const files = req.files as Record<string, Express.Multer.File[]>;
  const documents = files?.documents?.map((file: any) => file) ?? [];
  const result = await mentorService.verifyMentor(
    JSON.parse(req.body.body),
    documents,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Mentor verified successfully",
    data: result,
  });
});

const approveMentor = catchAsync(async (req, res) => {
  const { mentorId } = req.params as { mentorId: string };
  const user = req.user as RequestUser;
  await mentorService.approveMentor(mentorId, user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Mentor approved successfully",
    data: null,
  });
});

export const mentorController = { registerMentor, verifyMentor, approveMentor };
