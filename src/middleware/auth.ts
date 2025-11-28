import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuthService } from "@/lib/auth-service";

export async function authMiddleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const payload = AuthService.verifyToken(token);
    if (!payload) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, onboarded: true },
    });

    if (!user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    (req as any).user = user;
    return;
}
