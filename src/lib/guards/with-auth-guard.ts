import { AuthGuard } from "@/lib/guards/auth-guard";
import { handleApiError } from "@/lib/exceptions/handler";

export function withAuthGuard(handler: Function) {
    return async (req: Request, ...args: any[]) => {
        try {
            const payload = await AuthGuard.canActivate(req);
            return handler(req, payload, ...args);
        } catch (err) {
            return handleApiError(err);
        }
    };
}
