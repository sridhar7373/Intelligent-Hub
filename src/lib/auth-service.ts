import prisma from "@/lib/prisma";
import { randomInt } from "crypto";
import jwt from "jsonwebtoken";
import { addMinutes, isBefore } from "date-fns";
import { BadRequestException, UnauthorizedException } from "./exceptions";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export class AuthService {


    static async generateOTP(email: string) {

        const code = randomInt(100000, 999999).toString();
        const expiresAt = addMinutes(new Date(), 10);

        // 1. Invalidate all previous OTPs
        await prisma.oTP.updateMany({
            where: { email, used: false },
            data: { used: true }
        });

        // 2. Create new OTP
        await prisma.oTP.create({
            data: {
                email,
                code,
                expiresAt,
                used: false
            }
        });

        return { code, expiresAt };
    }


    static async verifyOTP(email: string, code: string) {
        const otp = await prisma.oTP.findFirst({
            where: {
                email,
                code,
                used: false,
            },
            orderBy: { expiresAt: "desc" }
        });

        if (!otp) {
            throw new UnauthorizedException("Invalid or incorrect OTP");
        }

        if (isBefore(otp.expiresAt, new Date())) {
            throw new UnauthorizedException("OTP expired");
        }

        await prisma.oTP.update({
            where: { id: otp.id },
            data: { used: true }
        });
        return true;
    }

    static async findOrCreateUser(email: string) {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return existing;

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    createdAt: new Date(),
                }
            });
            return user; 
        });

        return result;
    }

    static async completeOnboarding(userId: string, username: string, workspaceName: string, kbName: string)
    {
        try
        {
            const updatedUser = await prisma.$transaction(async (tx) => {
                const user = await tx.user.update({
                    where: { id: userId },
                    data: { username, onboarded: true },
                });
                const workspace = await tx.workspace.upsert({
                    where: { userId },
                    update: {
                        name: workspaceName,
                    },
                    create: {
                        userId,
                        name: workspaceName,
                    },
                });
                await tx.knowledgeBase.create({
                    data: { 
                        workspaceId: workspace.id,
                        name: kbName 
                    },
                });
                return user;
            });
            return updatedUser;
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }

    static generateToken(userId: string) {
        return jwt.sign(
            { userId },
            JWT_SECRET,
            { expiresIn: "7d" }
        );
    }

    static verifyToken(token: string) {
        try {
            return jwt.verify(token, JWT_SECRET) as { userId: string };
        }
        catch {
            return null;
        }
    }
}