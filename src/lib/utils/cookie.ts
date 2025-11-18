import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export interface CookieOptions {
    maxAge?: number;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "strict" | "lax" | "none";
}

export const defaultCookieOptions: Required<CookieOptions> = {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax"
};

export class CookieUtil {

    static setResponseCookie( res: NextResponse, name: string, value: string, options: CookieOptions = {}) {
        const finalOptions = {
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "lax" as "lax",
            ...options,
        };

        res.cookies.set({
            name,
            value,
            httpOnly: finalOptions.httpOnly,
            secure: finalOptions.secure,
            sameSite: finalOptions.sameSite, 
            path: finalOptions.path,
            maxAge: finalOptions.maxAge,
        });

        return res;
    }

    // For Server Components or Server Actions
    static async set(name: string, value: string, options: CookieOptions = {}) {
        const cookieStore = await cookies();
        cookieStore.set(name, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            ...options,
        });
    }

    static async get(name: string) {
        const cookieStore = await cookies();
        return cookieStore.get(name)?.value;
    }

    static async delete(name: string) {
        const cookieStore = await cookies();

        cookieStore.set(name, "", {
            ...defaultCookieOptions,
            expires: new Date(0)
        });
    }
}
