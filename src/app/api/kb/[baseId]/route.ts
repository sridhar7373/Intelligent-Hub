import { NextResponse } from "next/server";
import { AuthGuard } from "@/lib/guards/auth-guard";
import { handleApiError } from "@/lib/exceptions/handler";
import { NotFoundException } from "@/lib/exceptions";
import { KBService } from "@/lib/kb-service";

export async function GET( req: Request, context: { params: Promise<{ baseId: string }> }) {
  try {
    const user = await AuthGuard.canActivate(req);
    const { baseId } = await context.params;

    if (!user.workspace) {
        throw new NotFoundException("Workspace not found for this user");
    }

    const base = await KBService.getBaseById(user.workspace.id, baseId);

    if (!base) {
        throw new NotFoundException("Knowledge Base not found");
    }

    return NextResponse.json({
        ok: true,
        base
    });

  } catch (err) {
    return handleApiError(err);
  }
}
