import { NextResponse } from "next/server";
import { SendOtpSchema } from "./schema";
import { AuthService } from "@/lib/auth-service";
import { handleApiError } from "@/lib/exceptions/handler";
import { Validator } from "@/lib/validator";
import { env } from "@/lib/env";
import { NotificationManager } from "@/lib/notification/notification-manager";


export async function POST(req: Request)
{
    try
    {
        const body = await req.json();
        const validated = await Validator.validate(SendOtpSchema, body);
        const { code } = await AuthService.generateOTP(validated.email);
        NotificationManager.sendNotification("otp", {
            email: validated.email,
            userName: validated.email,
            otp: code,
            expiresIn: env.OTP_EXPIRY_MINUTES,
            appName: env.APP_NAME,
            year: new Date().getFullYear().toString(),
        }).then(() => {
            console.log("OTP email sent successfully");
        }).catch((err) => {
            console.error("Failed to send OTP email:", err);
        });
        return NextResponse.json({ ok: true });
    }
    catch (err) 
    {
        return handleApiError(err);
    }
}