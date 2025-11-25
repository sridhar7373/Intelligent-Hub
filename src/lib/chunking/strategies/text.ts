import { ChunkStrategy } from "../chunk-strategy";

export interface ChunkOptions {
    maxLength?: number;      // max chunk size
    overlap?: number;        // sliding window overlap
    preserveNewlines?: boolean;
}

export class TextChunkStrategy implements ChunkStrategy 
{
    chunk(content: string) 
    {
        return this.chunkText(content);
    }

    chunkText(text: string, options: ChunkOptions = {})
    {
        const { maxLength = 800, overlap = 100, preserveNewlines = false } = options;
        const paragraphs = text.split(/\n\s*\n+/);

        let chunks: string[] = [];

        for (let paragraph of paragraphs) {
            paragraph = this.normalizeText(paragraph, preserveNewlines);

            if (paragraph.length <= maxLength) {
                chunks.push(paragraph);
            } else {
                chunks.push(...this.splitBySentence(paragraph, maxLength));
            }
        }

        return this.applyOverlap(chunks, overlap);
    }


    normalizeText(text: string, preserveNewlines: boolean) {
        if (!text) return "";
        text = text.replace(/[\u0000-\u001F\u007F\u200B-\u200F\uFEFF]/g, "");
        text = text.replace(/[\uF000-\uF8FF]/g, "");
        text = text.replace(/[▪◦·]/g, "•");
        text = text.replace(/^\s*•\s*$/gm, "");
        text = text.replace(/[ \t]+/g, " ");

        if (preserveNewlines) {
            text = text.replace(/\n{3,}/g, "\n\n");
            text = text
                .split("\n")
                .map(l => l.trim())
                .join("\n");

            return text.trim();
        }
        return text
        .replace(/\r?\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }




    splitBySentence(text: string, maxLength: number): string[]
    {
        const sentences = text.split(/(?<=[.?!])\s+/);
        const result: string[] = [];
        let current = "";

        for (const s of sentences) {
            if ((current + s).length > maxLength) {
                result.push(current.trim());
                current = "";
            }
            current += s + " ";
        }
        if (current.trim()) result.push(current.trim());
        return result;
    }

    splitByWords(text: string, maxLength: number): string[]
    {
        const words = text.split(/\s+/);
        const result: string[] = [];
        let current = "";

        for (const w of words) {
            if ((current + w).length > maxLength) {
                result.push(current.trim());
                current = "";
            }
            current += w + " ";
        }

        if (current.trim()) result.push(current.trim());
        return result;
    }

    applyOverlap(chunks: string[], overlap: number): string[]
    {
        if (overlap <= 0) return chunks;
        const overlapped: string[] = [];

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];

            if (i === 0) {
                overlapped.push(chunk);
                continue;
            }

            const prev = chunks[i - 1];

            const overlapText = prev.slice(-overlap);
            const merged = (overlapText + " " + chunk).trim();

            overlapped.push(merged);
        }
        return overlapped;
    }
}


