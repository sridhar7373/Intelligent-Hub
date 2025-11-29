import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./middleware/auth";
import { onboardingMiddleware } from "./middleware/onboarding";
import { loginMiddleware } from "./middleware/login";

export async function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname;
  // 1) AUTH
  if (path.startsWith("/kb") || path.startsWith("/onboarding")) {
    const authResult = await authMiddleware(req);
    if (authResult) return authResult;
  }

  // 2) ONBOARDING RULES
  if (path.startsWith("/onboarding")) {
    const onboardingResult = onboardingMiddleware(req);
    if (onboardingResult) return onboardingResult;
  }

  // 3. BLOCK LOGIN FOR AUTHENTICATED USERS
  if (path === "/login" || path === "/verify-otp") {
    const loginCheck = loginMiddleware(req);
    if (loginCheck) return loginCheck;
  }

  // Done → continue to route
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/verify-otp",
    "/onboarding/:path*",
    "/kb/:path*"
  ],
  runtime: "nodejs"
};
