import { FileProcessorStrategy } from "./file-processor-strategy";
import { CsvProcessor } from "./strategies/csv-processor";
import { DocxProcessor } from "./strategies/docx-processor";
import { JsonProcessor } from "./strategies/json-processor";
import { PdfProcessor } from "./strategies/pdf-processor";
import { TextProcessor } from "./strategies/text-processor";
import { XlsxProcessor } from "./strategies/xlsx-processor";
import { YamlProcessor } from "./strategies/yaml-processor";
import { SupportedMimeType } from "./types";


const processorMap: Record<SupportedMimeType, FileProcessorStrategy> = {
    "text/plain": new TextProcessor(),
    "text/markdown": new TextProcessor(),
    "application/json": new JsonProcessor(),
    "application/pdf": new PdfProcessor(),
    "application/csv": new CsvProcessor(),
    "text/csv": new CsvProcessor(),
    "application/vnd.ms-excel": new CsvProcessor(),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": new XlsxProcessor(),
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": new DocxProcessor(),
    "application/x-yaml": new YamlProcessor(),
    "application/yaml": new YamlProcessor(),
    "text/yaml": new YamlProcessor(),
};

export class FileProcessorFactory {
    static getProcessor(mime: SupportedMimeType): FileProcessorStrategy {
        try
        {
            return processorMap[mime];
        }
        catch(err)
        {
            throw err;
        }
    }
}