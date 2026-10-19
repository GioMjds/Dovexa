import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email").trim().toLowerCase(),
});

export type LoginInput = z.infer<typeof loginSchema>;
