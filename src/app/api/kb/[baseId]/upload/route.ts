import { NextResponse } from "next/server";
import { AuthGuard } from "@/lib/guards/auth-guard";
import { handleApiError } from "@/lib/exceptions/handler";
import { BadRequestException, NotFoundException } from "@/lib/exceptions";
import { KBService } from "@/lib/kb-service";

const allowed = [
    "application/pdf",
    "text/plain",
    "application/json",
    "text/markdown",

    // YAML
    "application/x-yaml",
    "text/yaml",
    "text/x-yaml",
    "application/yaml",

    // DOCX
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    // XLSX
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    // CSV
    "text/csv",
    "application/csv",
    "application/vnd.ms-excel",
];


export async function POST(req: Request, context: { params: Promise<{ baseId: string }> }) {
    try {
        const { baseId } = await context.params;
        const user = await AuthGuard.canActivate(req);
        if (!user.workspace) {
            throw new NotFoundException("Workspace not found");
        }

        const base = await KBService.getBaseById(user.workspace.id, baseId);
        if (!base) {
            throw new NotFoundException("Knowledge Base not found");
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        if (!file) {
            throw new BadRequestException("File is required");
        }
        if (!allowed.includes(file.type)) {
            throw new BadRequestException("Unsupported file type");
        }
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const doc = await KBService.addDocument({
            name: file.name,
            type: file.type,
            size: file.size,
            baseId: base.id,
        });
        return NextResponse.json({
            ok: true,
            document: doc,
        });

    }
    catch (err) {
        return handleApiError(err);
    }
}