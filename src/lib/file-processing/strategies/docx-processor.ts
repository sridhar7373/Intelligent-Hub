import { extractRawText } from "mammoth";
import { ExtractedContent, FileProcessorStrategy } from "../file-processor-strategy";

export class DocxProcessor implements FileProcessorStrategy {
    async extractText(buffer: Buffer): Promise<ExtractedContent> {
        const result = await extractRawText({ buffer });
        return {
            type: "text",
            content: result.value
        };
    }
}
