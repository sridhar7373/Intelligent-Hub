import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./middleware/auth";
import { onboardingMiddleware } from "./middleware/onboarding";

export async function middleware(req: NextRequest) {
  // 1) AUTH
  const authResult = await authMiddleware(req);
  if (authResult) return authResult; 
  
  // 2) ONBOARDING RULES
  const onboardingResult = onboardingMiddleware(req);
  if (onboardingResult) return onboardingResult;

  // Done → continue to route
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/onboarding/:path*",
    "/kb/:path*"
  ],
  runtime: "nodejs"
};
