import { VectorDBDriver } from "./VectorDBDriver";


export class VectorDB {
    private driver: VectorDBDriver;
    private embedder: (text: string) => Promise<number[]>;

    constructor(driver: VectorDBDriver, embedder: (text: string) => Promise<number[]>) {
        this.driver = driver;
        this.embedder = embedder;
    }

    async initCollection(collection: string) {
        await this.driver.initCollection(collection);
    }

    async addDocument(collection: string, id: string, text: string, payload: any = {}) {
        const vector = await this.embedder(text);
        await this.driver.upsert(collection, [{ id, vector, payload: { text, ...payload } }]);
        return { id, text };
    }

    async search(collection: string, text: string, limit = 5) {
        const vector = await this.embedder(text);
        return this.driver.search(collection, vector, limit);
    }

    async delete(collection: string, id: string) {
        await this.driver.delete(collection, [id]);
    }
}