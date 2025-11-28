import { env } from "../env";
import { LocalStorage } from "./providers/local-storage";
import { StorageProvider } from "./storage-provider";


const storageMap:Record<string, StorageProvider> = {
    "local": new LocalStorage()
};

export class StorageFactory
{
    static getProvider(): StorageProvider
    {
        try
        {
            return storageMap[env.STORAGE_PROVIDER];
        }
        catch(err)
        {
            throw err;
        }
    }
}
