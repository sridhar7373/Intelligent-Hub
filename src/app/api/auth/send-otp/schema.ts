import { z } from "zod";

export const SendOtpSchema = z.object({
  email: z.string().email("Invalid email")
});
