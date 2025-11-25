import { ExtractedContent, FileProcessorStrategy } from "../file-processor-strategy";

export class CsvProcessor implements FileProcessorStrategy {
    async extractText(buffer: Buffer): Promise<ExtractedContent> {
        const rows = buffer.toString("utf8")
        .split("\n")
        .map(row => row.split(","));
        return {
            type: "json",
            content: rows
        };
    }
}
