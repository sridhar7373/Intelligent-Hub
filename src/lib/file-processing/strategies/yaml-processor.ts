import yaml from "js-yaml";
import { ExtractedContent, FileProcessorStrategy } from "../file-processor-strategy";

export class YamlProcessor implements FileProcessorStrategy {
    async extractText(buffer: Buffer): Promise<ExtractedContent> {
        const parsed = yaml.load(buffer.toString("utf8"));
        return {
            type: "json",
            content: parsed!
        };
    }
}
