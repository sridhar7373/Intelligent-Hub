import { NextResponse } from "next/server";
import { AuthGuard } from "@/lib/guards/auth-guard";
import { handleApiError } from "@/lib/exceptions/handler";
import { BadRequestException, NotFoundException } from "@/lib/exceptions";
import { KBService } from "@/lib/kb-service";
import { processKnowledgeDocument } from "@/lib/kb-pipeline";
import { SUPPORTED_EXTENSIONS, SUPPORTED_MIME_TYPES, SupportedExtension, SupportedMimeType } from "@/lib/file-processing/types";
import { getFileExtension } from "@/lib/utils/file";
import { StorageFactory } from "@/lib/storage/storage-factory";
import { SubscriptionService } from "@/lib/subscription-service";
import { FeatureKey } from "@/types/plan";


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

        const docLimit = await SubscriptionService.getFeatureValue(user.workspace.id, FeatureKey.DOCUMENTS);
        const currentDocCount = await KBService.countDocumentsInBase(base.id);
        if (currentDocCount >= docLimit) {
            throw new BadRequestException(`Document limit reached. Your current plan allows up to ${docLimit} documents. Please upgrade your plan to add more documents.`
            );
        }
        // ---- FILE READ ----

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const storage = StorageFactory.getProvider();

        const storageKey = `kb/${user.workspace.id}/${base.id}/${Date.now()}-${file.name}`;
        if (storage.upload) {
            await storage.upload(storageKey, buffer, file.type);
        }

        const doc = await KBService.addDocument({
            name: file.name,
            type: file.type,
            size: file.size,
            baseId: base.id,
            url: storageKey,
        });

        return NextResponse.json({
            ok: true,
            document: doc,
        });

    } catch (err) {
        return handleApiError(err);
    }
}