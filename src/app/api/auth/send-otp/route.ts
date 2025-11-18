import { NextResponse } from "next/server";
import { SendOtpSchema } from "./schema";
import { AuthService } from "@/lib/auth-service";
import { handleApiError } from "@/lib/exceptions/handler";
import { Validator } from "@/lib/validator";


export async function POST(req: Request)
{
    try
    {
        const body = await req.json();
        const validated = await Validator.validate(SendOtpSchema, body);
        const { code } = await AuthService.generateOTP(validated.email);
        console.log("send OTP to mail:", code);
        return NextResponse.json({ ok: true });
    }
    catch (err) 
    {
        return handleApiError(err);
    }
}