export interface ChunkStrategy {
    chunk(content: any): string[];
}
