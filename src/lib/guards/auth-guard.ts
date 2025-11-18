import { NotFoundException, UnauthorizedException } from "@/lib/exceptions";
import { AuthService } from "@/lib/auth-service";
import { CookieUtil } from "@/lib/utils/cookie";
import prisma from "@/lib/prisma";

export class AuthGuard {
    static async extractToken(req: Request): Promise<string | null> {
        const cookieToken = await CookieUtil.get("token");
        if (cookieToken) {
            return cookieToken;
        }
        return null;
    }

    // Main Auth Guard
    static async canActivate(req: Request) {
        // 1. Extract token
        const token = await this.extractToken(req);

        if (!token) {
            throw new UnauthorizedException("Missing authentication token");
        }

        // 2. Verify and decode token
        const payload = AuthService.verifyToken(token);
        if (!payload) {
            throw new UnauthorizedException("Invalid or expired token");
        }

        // 3. Fetch the user from DB
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            include: {
                workspace: {
                    include: {
                        bases: true
                    }
                },
            },
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        // 4. Return user (NOT just payload)
        return user;
    }
}
