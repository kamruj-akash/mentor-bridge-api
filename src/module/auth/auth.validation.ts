import { z } from "zod";

export const RegisterUserZod = z.object({
  name: z.string("Not a String").min(3).max(255),
  email: z.string().email("invalid email").min(3),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(64, "Password must be at most 64 characters"),
  role: z.enum(["STUDENT", "MENTOR", "ADMIN"], "Invalid role").optional(),
});

export const LoginUserZod = z.object({
  email: z.string().email("invalid email").min(3),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(64, "Password must be at most 64 characters"),
});

export const GLoginZod = z.object({
  idToken: z.string(),
});
