import type { Request, Response } from "express";
import httpStatus from "http-status";
import type { IQuery } from "../../interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { assignmentService } from "./assignment.service";

const createAssignment = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Record<string, Express.Multer.File[]>;
  const attachment = files?.attachment?.[0];
  const assignment = await assignmentService.createAssignment(
    req.body.body,
    attachment,
    req.user!,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Assignment created successfully",
    data: assignment,
  });
});

const getOpenAssignments = catchAsync(async (req: Request, res: Response) => {
  const query: IQuery = req.query;
  const data = await assignmentService.getOpenAssignments(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Assignments retrieved successfully",
    data,
  });
});

export const assignmentController = {
  createAssignment,
  getOpenAssignments,
};
