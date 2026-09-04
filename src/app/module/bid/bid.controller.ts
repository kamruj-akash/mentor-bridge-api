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

const getBidByAssignmentId = catchAsync(async (req: Request, res: Response) => {
  const assignmentId = req.params.assignmentId;
  const query = req.query;
  const data = await bidService.getBidByAssignmentId(
    assignmentId as string,
    req.user as RequestUser,
    query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bids retrieved successfully",
    data: data.bids,
    meta: data.meta,
  });
});

const getMyBids = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const data = await bidService.getMyBids(req.user as RequestUser, query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "My bids retrieved successfully",
    data: data.bids,
    meta: data.meta,
  });
});

const deleteBid = catchAsync(async (req: Request, res: Response) => {
  await bidService.deleteBid(
    req.params.bidId as string,
    req.user as RequestUser,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bid deleted successfully",
    data: null,
  });
});

export const bidController = {
  bidAssignment,
  getBidByAssignmentId,
  getMyBids,
  deleteBid,
};
