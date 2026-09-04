import { z } from "zod";

export const CreateAssignmentZod = z.object({
  title: z
    .string("Title must be a string")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be at most 200 characters")
    .trim(),
  description: z
    .string("Description must be a string")
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be at most 2000 characters")
    .trim(),
  budget: z
    .number("Budget must be a number")
    .positive("Budget must be greater than 0"),
  deadline: z
    .string("Deadline must be a string")
    .datetime("Deadline must be a valid ISO date string")
    .refine((val) => new Date(val) > new Date(), {
      message: "Deadline must be in the future",
    }),
});

export type TCreateAssignment = z.infer<typeof CreateAssignmentZod>;
