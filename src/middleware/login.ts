import { NextRequest, NextResponse } from "next/server";

export function loginMiddleware(req: NextRequest) {
  const user = (req as any).user;
  const path = req.nextUrl.pathname;

  const blockedForAuthenticated = ["/login", "/verify-otp"];

  if (!blockedForAuthenticated.some(p => path.startsWith(p))) {
    return; 
  }

  if (user) {
    const url = req.nextUrl.clone();
    url.pathname = "/kb"; // or "/dashboard"
    return NextResponse.redirect(url);
  }

  return;
}
