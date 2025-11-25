import { PdfReader } from "pdfreader";
import { ExtractedContent, FileProcessorStrategy } from "../file-processor-strategy";

export class PdfProcessor implements FileProcessorStrategy {
    async extractText(buffer: Buffer): Promise<ExtractedContent> {
        const reader = new PdfReader();

        const text = await new Promise<string>((resolve, reject) => {
            const lines: string[] = [];

            reader.parseBuffer(buffer, (err, item) => {
                if (err) return reject(err);

                // End of file
                if (!item) {
                    resolve(lines.join("\n"));
                    return;
                }

                // Extract text items
                if (item.text) {
                    lines.push(item.text);
                }
            });
        });

        return {
            type: "text",
            content: text
        };
    }
}
