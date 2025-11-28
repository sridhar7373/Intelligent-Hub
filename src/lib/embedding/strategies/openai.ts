import { EmbeddingStrategy } from "../embedding-strategy";


export class OpenAIEmbeddingStrategy implements EmbeddingStrategy
{
    async embed(text: string): Promise<number[]> {
        throw new Error("Method not implemented.");
    }
    async embedBatch?(texts: string[]): Promise<number[][]> {
        throw new Error("Method not implemented.");
    }

}