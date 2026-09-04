import type { Request, Response } from "express";
import httpStatus from "http-status";
import type { RequestUser } from "../../middleware/authCheck";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bidService } from "./bid.service";

const bidAssignment = catchAsync(async (req: Request, res: Response) => {
  const assignment = await bidService.bidAssignment(
    req.body,
    req.user as RequestUser,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bid placed successfully",
    data: assignment,
  });
});

export const bidController = {
  bidAssignment,
};
