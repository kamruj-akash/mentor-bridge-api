import { z } from "zod";

export const BidAssignmentZod = z.object({
  proposedAmount: z
    .number("Proposed amount must be a number")
    .positive("Proposed amount must be greater than 0"),
  estimatedDelivery: z
    .string("Estimated delivery must be a string")
    .datetime("Estimated delivery must be a valid ISO date string")
    .refine((val) => new Date(val) > new Date(), {
      message: "Estimated delivery must be in the future",
    }),
  coverNote: z
    .string("Cover note must be a string")
    .min(10, "Cover note must be at least 10 characters")
    .max(1000, "Cover note must be at most 1000 characters")
    .trim(),
  assignmentId: z
    .string("Assignment ID must be a string")
    .uuid("Assignment ID must be a valid UUID"),
});
