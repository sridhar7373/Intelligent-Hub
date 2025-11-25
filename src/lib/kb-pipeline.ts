import { Document } from "@/types/document";
import { FileProcessorFactory } from "./file-processing/file-processor-factory";
import { ChunkerFactory } from "./chunking/chunker-factory";
import { SupportedMimeType } from "./file-processing/types";


export async function processKnowledgeDocument(doc: Document, file: File, buffer: Buffer)
{
    const mime = file.type as SupportedMimeType;
    const processor = FileProcessorFactory.getProcessor(mime);
    const { type, content } = await processor.extractText(buffer);

    const chunker = ChunkerFactory.getChunker(type);
    const chunks = chunker.chunk(content);

    const points = chunks.map((chunk, i) => ({
        id: `${doc.id}-${i}`,
        vector: [], // embed later
        metadata: {
            documentId: doc.id,
            chunkIndex: i,
            text: chunk,
            fileName: file.name,
        }
    }));
    return { chunks: chunks.length };
}