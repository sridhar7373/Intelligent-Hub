import { ExtractedContent, FileProcessorStrategy } from "../file-processor-strategy";

export class JsonProcessor implements FileProcessorStrategy 
{
    async extractText(buffer: Buffer): Promise<ExtractedContent> 
    {
        try {
            const json = JSON.parse(buffer.toString("utf8"));
            return {
                type: "json",
                content: json
            };

        } catch (err) {
            throw new Error("Invalid JSON file: " + (err as Error).message);
        }
    }
}
