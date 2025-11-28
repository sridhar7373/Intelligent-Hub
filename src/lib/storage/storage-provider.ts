export interface StorageProvider {
    getPresignedUploadUrl(key: string, contentType: string): Promise<string>;
    upload?(key: string, file: Buffer, contentType: string): Promise<void>;
    getFileUrl(key: string): Promise<string>;
    deleteFile(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
}
