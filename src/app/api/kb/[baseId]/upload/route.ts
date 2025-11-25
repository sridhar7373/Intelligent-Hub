import { NextResponse } from "next/server";
import { AuthGuard } from "@/lib/guards/auth-guard";
import { handleApiError } from "@/lib/exceptions/handler";
import { BadRequestException, NotFoundException } from "@/lib/exceptions";
import { KBService } from "@/lib/kb-service";
import { processKnowledgeDocument } from "@/lib/kb-pipeline";
import { SUPPORTED_EXTENSIONS, SUPPORTED_MIME_TYPES, SupportedExtension, SupportedMimeType } from "@/lib/file-processing/types";
import { getFileExtension } from "@/lib/utils/file";


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

        // ---- FILE VALIDATION ----

        const ext = getFileExtension(file.name);

        const isMimeAllowed = SUPPORTED_MIME_TYPES.includes(file.type as SupportedMimeType);
        const isExtAllowed = SUPPORTED_EXTENSIONS.includes(ext as SupportedExtension);

        const isOctetStream = file.type === "application/octet-stream";

        if (!isExtAllowed && (!isMimeAllowed || isOctetStream)) {
            throw new BadRequestException(`Unsupported file type: ${file.name}`);
        }

        if (!isMimeAllowed && !isExtAllowed) {
            throw new BadRequestException(
                `Unsupported file type: mime=${file.type}, ext=.${ext}`
            );
        }

        // ---- FILE READ ----

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const doc = await KBService.addDocument({
            name: file.name,
            type: file.type,
            size: file.size,
            baseId: base.id,
        });

        // ---- FILE PROCESSING (async) ----

        processKnowledgeDocument(doc, file, buffer)
            .then(() => console.log("File processing..."))
            .catch((err: any) => console.error(err));

        return NextResponse.json({
            ok: true,
            document: doc,
        });

    } catch (err) {
        return handleApiError(err);
    }
}