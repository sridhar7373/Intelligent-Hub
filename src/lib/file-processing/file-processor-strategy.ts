export type ExtractedType = "text" | "json";

export interface ExtractedContent {
    type: ExtractedType;
    content: string | object | any[];
}


export interface FileProcessorStrategy {
    extractText(buffer: Buffer): Promise<ExtractedContent>;
}