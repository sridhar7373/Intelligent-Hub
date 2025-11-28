import fs from "fs/promises";
import path from "path";
import { StorageProvider } from "../storage-provider";
import { env } from "@/lib/env";

export class LocalStorage implements StorageProvider {
    private basePath: string;

    constructor() {
        this.basePath = path.join(process.cwd(), env.UPLOAD_DIR);
        this.ensureBaseFolderExists();
    }

    private normalizeKey(key: string) {
        // Remove leading slash if present
        return key.replace(/^\/+/, "");
    }

    private async ensureBaseFolderExists() {
        try {
            await fs.mkdir(this.basePath, { recursive: true });
        } catch (err) {
            console.error("Failed to create storage base folder:", err);
            throw err;
        }
    }

    async getPresignedUploadUrl(): Promise<string> {
        throw new Error("Local storage does not support presigned URLs");
    }

    async upload(key: string, file: Buffer, contentType: string): Promise<void> {
        key = this.normalizeKey(key);
        const filePath = path.join(this.basePath, key);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, file);
    }

    async getFileUrl(key: string): Promise<string> {
        key = this.normalizeKey(key);
        return `/${env.UPLOAD_DIR}/${key}`;
    }

    async deleteFile(key: string) {
        key = this.normalizeKey(key);
        await fs.rm(path.join(this.basePath, key), { force: true });
    }

    async exists(key: string) {
        key = this.normalizeKey(key);
        try {
            await fs.stat(path.join(this.basePath, key));
            return true;
        } catch {
            return false;
        }
    }
}
