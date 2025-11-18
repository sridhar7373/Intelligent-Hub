import { z } from "zod";

export const OnboardingSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(30, "Username is too long"),

  workspaceName: z
    .string()
    .min(2, "Workspace name must be at least 2 characters")
    .max(50),
  kbName: z
    .string()
    .trim()
    .min(2, "Knowledge base name required")
    .max(40),
});

export type OnboardingInput = z.infer<typeof OnboardingSchema>;
