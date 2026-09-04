import type { UploadApiResponse } from "cloudinary";
import httpStatus from "http-status";
import { AssignmentStatus } from "../../../../prisma/src/generated/prisma/enums";
import type { AssignmentWhereInput } from "../../../../prisma/src/generated/prisma/models";
import type { IQuery } from "../../interface";
import cloudinary from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import type { RequestUser } from "../../middleware/authCheck";
import { AppError } from "../../utils/AppError";
import type { ICreateAssignment } from "./assignment.interface";

const createAssignment = async (
  payload: ICreateAssignment,
  reqUser: RequestUser,
  attachments?: Express.Multer.File,
) => {
  console.log(payload)
  const { title, description, budget, deadline } = payload;
  const existUser = await prisma.user.findUnique({
    where: { id: reqUser.userId },
    include: {
      student: true,
    },
  });

  let attachmentUrl: UploadApiResponse | null = null;
  if (attachments) {
    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "auto", folder: "assignment-attachments" },
            async (error, result) => {
              if (error) {
                return reject(error);
              }

              if (!result) {
                return reject(
                  new AppError(
                    httpStatus.INTERNAL_SERVER_ERROR,
                    "No result returned from Cloudinary",
                  ),
                );
              }
              resolve(result);
            },
          )
          .end(attachments.buffer);
      },
    );
    attachmentUrl = uploadResult;
  }

  const assignment = await prisma.assignment.create({
    data: {
      studentId: existUser?.student?.id as string,
      title,
      description,
      attachmentUrl: attachmentUrl
        ? {
            secure_url: attachmentUrl.secure_url,
            publicId: attachmentUrl.public_id,
          }
        : undefined,
      budget,
      deadline,
    },
  });
  return assignment;
};

const getOpenAssignments = async (query: IQuery) => {
  const searchTerm = query.searchTerm || "";
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "asc";
  const andConditions: AssignmentWhereInput[] = [
    {
      status: AssignmentStatus.OPEN,
    },
  ];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  const assignments = await prisma.assignment.findMany({
    where: {
      AND: andConditions,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.assignment.count({
    where: {
      AND: andConditions,
    },
  });

  const totalPages = Math.ceil(total / limit);

  return {
    data: assignments,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};
export const assignmentService = {
  createAssignment,
  getOpenAssignments,
};
