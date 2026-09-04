import httpStatus from "http-status";
import {
  AssignmentStatus,
  Role,
} from "../../../../prisma/src/generated/prisma/enums";
import type { IQuery } from "../../interface";
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

const getBidByAssignmentId = async (
  assignmentId: string,
  user: RequestUser,
  query: IQuery,
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "asc";

  const existUser = await prisma.user.findUnique({
    where: { id: user.userId },
    include: { student: true },
  });
  if (!existUser || !existUser.student) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only students can view bids on assignments",
    );
  }
  const existAssignment = await prisma.assignment.findUnique({
    where: { id: assignmentId, studentId: existUser.student.id },
  });
  if (!existAssignment) {
    throw new AppError(httpStatus.NOT_FOUND, "Assignment not found");
  }
  const bids = await prisma.assignmentBid.findMany({
    where: { assignmentId },
    include: {
      expert: {
        select: {
          department: true,
          verificationStatus: true,
          university: true,
          ratePerAssignment: true,
          bio: true,
          user: {
            select: {
              id: true,
              name: true,
              createdAt: true,
            },
          },
        },
      },
    },
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * limit,
    take: limit,
  });
  const total = await prisma.assignmentBid.count({
    where: { assignmentId },
  });
  const totalPages = Math.ceil(total / limit);

  return {
    bids,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

const getMyBids = async (user: RequestUser, query: IQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "asc";

  const existExpert = await prisma.user.findUnique({
    where: { id: user.userId, role: Role.EXPERT },
    include: { expert: true },
  });
  if (!existExpert || !existExpert.expert) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only experts can view their bids",
    );
  }
  const bids = await prisma.assignmentBid.findMany({
    where: { expertId: existExpert.expert.id },
    include: {
      assignment: {
        select: {
          title: true,
          description: true,
          status: true,
          createdAt: true,
        },
      },
    },
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * limit,
    take: limit,
  });
  const total = await prisma.assignmentBid.count({
    where: { expertId: existExpert.expert.id },
  });
  const totalPages = Math.ceil(total / limit);

  return {
    bids,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

const deleteBid = async (bidId: string, user: RequestUser) => {
  const existExpert = await prisma.user.findUnique({
    where: { id: user.userId, role: Role.EXPERT },
    include: { expert: true },
  });

  if (!existExpert || !existExpert.expert) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Only experts can delete their bids",
    );
  }

  const bid = await prisma.assignmentBid.findUnique({
    where: { id: bidId, expertId: existExpert.expert.id },
  });

  if (!bid) {
    throw new AppError(httpStatus.NOT_FOUND, "Bid not found");
  }

  await prisma.assignmentBid.delete({
    where: { id: bidId, expertId: existExpert.expert.id },
  });

  return;
};

export const bidService = {
  bidAssignment,
  getBidByAssignmentId,
  getMyBids,
  deleteBid,
};
