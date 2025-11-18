import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AuthGuard } from "@/lib/guards/auth-guard";
import { handleApiError } from "@/lib/exceptions/handler";
import { NotFoundException } from "@/lib/exceptions";

export async function GET(req: Request) {
    try {
        const user = await AuthGuard.canActivate(req);
        return NextResponse.json({
            ok: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                onboarded: user.onboarded,
                workspace: user.workspace
                    ? {
                        id: user.workspace.id,
                        name: user.workspace.name,
                        createdAt: user.workspace.createdAt,
                    }
                    : null,
                kb: user.workspace?.bases?.[0] ?? null,
            },
        });

    } catch (err) {
        return handleApiError(err);
    }
}