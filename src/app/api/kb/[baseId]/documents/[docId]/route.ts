import { NextResponse } from "next/server";
import { AuthGuard } from "@/lib/guards/auth-guard";
import { KBService } from "@/lib/kb-service";
import { handleApiError } from "@/lib/exceptions/handler";

export async function DELETE(req: Request, context: { params: Promise<{ baseId: string, docId: string }> }) {
    try {
        await AuthGuard.canActivate(req);
        const { baseId, docId } = await context.params;
        const doc = await KBService.deleteDocument(baseId, docId)
        return NextResponse.json({ ok: true, message: "Document deleted!" });
    }
    catch (err) {
        return handleApiError(err);
    }
}
