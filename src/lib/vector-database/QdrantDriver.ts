import { VectorDB } from "./VectorDB";
import { SearchResult, VectorDBDriver, VectorPoint } from "./VectorDBDriver";
import { QdrantClient } from '@qdrant/js-client-rest';

export class QdrantDriver implements VectorDBDriver {

    private client: QdrantClient;
    private size: number;


    constructor(url: string, vectorSize: number) {
        this.client = new QdrantClient({ url });
        this.size = vectorSize;
    }

    async initCollection(collection: string) {
        const collections = await this.client.getCollections();
        const exists = collections.collections?.some(c => c.name === collection);
        if (!exists) {
            await this.client.createCollection(collection, {
                vectors: { size: this.size, distance: 'Cosine' }
            });
        }
    }

    async upsert(collection: string, points: VectorPoint[]): Promise<void> {
        await this.initCollection(collection);
        await this.client.upsert(collection, {
            points: points.map(p => ({ id: p.id, vector: p.vector, payload: p.payload }))
        });
    }

    async search(collection: string, query: number[], limit: number): Promise<SearchResult[]> {
        await this.initCollection(collection);
        const result = await this.client.search(collection, {
            vector: query,
            limit,
            with_payload: true,
        });
        return result.map(r => ({ id: r.id + '', score: r.score, payload: r.payload }));
    }

    async delete(collection: string, ids: string[]) {
        await this.initCollection(collection);
        await this.client.delete(collection, { points: ids });
    }

}