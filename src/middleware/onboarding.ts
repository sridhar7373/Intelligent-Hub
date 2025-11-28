import { NextRequest, NextResponse } from "next/server";

export function onboardingMiddleware(req: NextRequest) {
  const user = (req as any).user;
  const path = req.nextUrl.pathname;

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!user.onboarded && path.startsWith("/kb")) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (user.onboarded && path.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/kb", req.url));
  }

  return;
}