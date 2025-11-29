// env.ts
import { z } from "zod";

const schema = z.object({
  // Server-only
  APP_NAME: z.string().default("MyApp"),
  DATABASE_URL: z.string(),

  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  OTP_EXPIRY_MINUTES: z.string(),

  MAIL_PROVIDER: z.enum(["smtp", "resend"]).default("resend"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string(),

  STORAGE_PROVIDER: z.enum(["local", "s3"]),
  UPLOAD_DIR: z.string(),
  MAX_UPLOAD_SIZE: z.string(),

  QDRANT_URL: z.string(),
  QDRANT_API_KEY: z.string(),
  QDRANT_VECTOR_SIZE: z.string(),
  QDRANT_DISTANCE: z.string(),
  
});

// Validate once when the app loads
export const env = schema.parse(process.env);
