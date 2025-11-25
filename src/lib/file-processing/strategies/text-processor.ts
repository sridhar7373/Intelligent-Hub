import { ExtractedContent, FileProcessorStrategy } from "../file-processor-strategy";


export class TextProcessor implements FileProcessorStrategy
{
    async extractText(buffer: Buffer): Promise<ExtractedContent> {
        const content = buffer.toString("utf8");
        return {
            type: "text",
            content: content
        }
    }
    
}