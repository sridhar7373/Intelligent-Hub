export interface EmbeddingStrategy {
    embed(text: string): Promise<number[]>;
    embedBatch?(texts: string[]): Promise<number[][]>;
}