import { OpenAIEmbeddingStrategy } from "./strategies/openai";

export class EmbeddingFactory {
    static getEmbedder() {
        return new OpenAIEmbeddingStrategy();
    }
}
