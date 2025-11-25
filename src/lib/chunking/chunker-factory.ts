import { ExtractedType } from "../file-processing/file-processor-strategy";
import { ChunkStrategy } from "./chunk-strategy";
import { JsonChunkStrategy } from "./strategies/json";
import { TextChunkStrategy } from "./strategies/text";



const chunkerMap: Record<ExtractedType, ChunkStrategy> = {
    text: new TextChunkStrategy(),
    json: new JsonChunkStrategy(),
};

export class ChunkerFactory {
    static getChunker(type: ExtractedType): ChunkStrategy {
        return chunkerMap[type];
    }
}