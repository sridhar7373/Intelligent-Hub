export interface SearchResult {
id: string;
score: number;
payload?: Record<string, any>| null;
}

export interface VectorPoint {
    id: string;
    vector: number[];
    payload: Record<string, any>;
}

export interface VectorDBDriver {
    initCollection(collection: string): Promise<void>;
    upsert(collection: string, points: VectorPoint[]): Promise<void>;
    search(collection: string, query: number[], limit: number): Promise<SearchResult[]>;
    delete(collection: string, ids: string[]): Promise<void>;
}