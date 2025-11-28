import { StorageProvider } from "../storage-provider";



export class S3Storage implements StorageProvider
{
    getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    upload?(key: string, file: Buffer, contentType: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getFileUrl(key: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    deleteFile(key: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    exists(key: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}