import { NextResponse } from "next/server";
import { AuthGuard } from "@/lib/guards/auth-guard";
import { handleApiError } from "@/lib/exceptions/handler";
import { AuthService } from "@/lib/auth-service";
import { Validator } from "@/lib/validator";
import { OnboardingSchema } from "./schema";
import { BadRequestException } from "@/lib/exceptions";

export async function POST(req: Request) {
  try {
    const { id: userId } = await AuthGuard.canActivate(req);
    const body = await req.json();
    const validated = await Validator.validate(OnboardingSchema, body);
    const user = await AuthService.completeOnboarding(userId, validated.username, validated.workspaceName, validated.kbName);
    if(!user){
      throw new BadRequestException("Onboarding")
    }
    return NextResponse.json({ ok: true, user });
  } catch (err) {
    return handleApiError(err);
  }
}