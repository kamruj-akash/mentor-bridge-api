import httpStatus from "http-status";
import {
  AssignmentStatus,
  Role,
} from "../../../../prisma/src/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type { RequestUser } from "../../middleware/authCheck";
import { AppError } from "../../utils/AppError";
import type { IBidAssignment } from "./bid.interface";

const bidAssignment = async (
  bidPayload: IBidAssignment,
  reqUser: RequestUser,
) => {
  const { assignmentId, proposedAmount, estimatedDelivery, coverNote } =
    bidPayload;
  const existExpert = await prisma.user.findUnique({
    where: { id: reqUser.userId, role: Role.EXPERT },
    include: { expert: true },
  });
  if (!existExpert || !existExpert.expert) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only experts can place bids on assignments",
    );
  }
  const existBid = await prisma.assignmentBid.findFirst({
    where: {
      assignmentId,
      expertId: existExpert.expert.id,
    },
  });
  if (existBid) {
    throw new AppError(
      httpStatus.CONFLICT,
      "You have already placed a bid on this assignment",
    );
  }
  const existAssignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });
  if (!existAssignment) {
    throw new AppError(httpStatus.NOT_FOUND, "Assignment not found");
  }
  if (existAssignment.status !== AssignmentStatus.OPEN) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot place a bid on a closed assignment",
    );
  }

  const bid = await prisma.assignmentBid.create({
    data: {
      proposedAmount,
      estimatedDelivery,
      coverNote,
      assignmentId,
      expertId: existExpert.expert.id,
    },
  });

  return bid;
};

export const bidService = {
  bidAssignment,
};
