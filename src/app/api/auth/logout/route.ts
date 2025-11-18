import { UnauthorizedException } from "@/lib/exceptions";
import { handleApiError } from "@/lib/exceptions/handler";
import { AuthGuard } from "@/lib/guards/auth-guard";
import { CookieUtil } from "@/lib/utils/cookie";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try
    {
        const user = await AuthGuard.canActivate(req);
        if(!user){
            throw new UnauthorizedException();
        }
        CookieUtil.delete("token");
        return NextResponse.json({ok: true});
    }
    catch (err) {
        return handleApiError(err);
    }
}