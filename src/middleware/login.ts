import { NextRequest, NextResponse } from "next/server";

export function loginMiddleware(req: NextRequest) {
  const user = (req as any).user;
  const path = req.nextUrl.pathname;

  // Only check login page
  if (!path.startsWith("/login")) return;

  // If already authenticated → prevent login page
  if (user) {
    const url = req.nextUrl.clone();
    url.pathname = "/kb";
    return NextResponse.redirect(url);
  }

  // Allow login page for unauthenticated users
  return;
}
