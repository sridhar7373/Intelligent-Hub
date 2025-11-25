import { ChunkStrategy } from "../chunk-strategy";

export class JsonChunkStrategy implements ChunkStrategy {

    chunk(content: any): string[] {

        // Top-level array → 1 item = 1 chunk
        if (Array.isArray(content)) {
            return content.map(item => JSON.stringify(item, null, 2));
        }

        // Single object → 1 chunk
        if (typeof content === "object") {
            return [JSON.stringify(content, null, 2)];
        }

        // Primitive fallback
        return [String(content)];
    }
}
