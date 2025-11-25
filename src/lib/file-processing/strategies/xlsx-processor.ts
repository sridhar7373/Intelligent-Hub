import * as xlsx from "xlsx";
import { ExtractedContent, FileProcessorStrategy } from "../file-processor-strategy";

export class XlsxProcessor implements FileProcessorStrategy {
    async extractText(buffer: Buffer): Promise<ExtractedContent> {
        const workbook = xlsx.read(buffer);
        const rows: any[] = [];

        workbook.SheetNames.forEach(name => {
            const sheet = workbook.Sheets[name];
            rows.push(...xlsx.utils.sheet_to_json(sheet));
        });

        return {
            type: "json",
            content: rows
        };
    }
}
