import { z } from "zod";

export const VerifyOtpSchema = z.object({
  email: z.string().email("Invalid email"),
  code: z.string().length(6, "OTP must be 6 digits")
});
