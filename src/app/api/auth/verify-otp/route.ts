import { NextResponse } from "next/server";
import { Validator } from "@/lib/validator";
import { VerifyOtpSchema } from "./schema";
import { AuthService } from "@/lib/auth-service";
import { handleApiError } from "@/lib/exceptions/handler";
import { CookieUtil } from "@/lib/utils/cookie";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validated = await Validator.validate(VerifyOtpSchema, body);
        await AuthService.verifyOTP(validated.email, validated.code);
        const user = await AuthService.findOrCreateUser(validated.email);
        const token = AuthService.generateToken(user.id);
        const res = NextResponse.json({ ok: true, token, user });
        CookieUtil.setResponseCookie(res,"token", token);
        return res;
    }
    catch (err) {
        return handleApiError(err);
    }
}