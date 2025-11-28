import { Document } from "@/types/document";
import { FileProcessorFactory } from "./file-processing/file-processor-factory";
import { ChunkerFactory } from "./chunking/chunker-factory";
import { SupportedMimeType } from "./file-processing/types";
import { EmbeddingFactory } from "./embedding/embedding-factory";
import { VectorDB } from "./vector-database/VectorDB";
import { QdrantDriver } from "./vector-database/QdrantDriver";


export async function processKnowledgeDocument(namespace: string ,doc: Document, file: File, buffer: Buffer)
{
    const mime = file.type as SupportedMimeType;
    const processor = FileProcessorFactory.getProcessor(mime);
    const { type, content } = await processor.extractText(buffer);

    const chunker = ChunkerFactory.getChunker(type);
    const chunks = chunker.chunk(content);

    const embedder = EmbeddingFactory.getEmbedder();
    const vectorDB = new VectorDB(
        new QdrantDriver(process.env.QDRANT_URL!,1536),
        async (text:string) => embedder.embed(text)
    )

    for (let i = 0; i < chunks.length; i++)
    {
        const chunk = chunks[i];
        const id = `${doc.id}-${i}`;
        const meta = {
            documentId: doc.id,
            chunkIndex: i,
            fileName: file.name,
            mime: mime,
        };
       await vectorDB.addDocument(namespace, id, chunk, meta);

    }
    return { chunks: chunks.length };
}