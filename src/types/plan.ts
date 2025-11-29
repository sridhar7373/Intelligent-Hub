export interface Plan {
    id: string;
    name: string;
    price: number;
    features:Feature;
}

export type Feature = {
    workspaces: number;
    knowledgeBases: number;
    documents: number;
    pages: number;
    searchQueriesPerMonth: number;
    teamMembers: number;
    chatWithDocs: boolean;
    apiAccess: boolean;
    support: string;
    [key: string]: any;
}

export enum FeatureKey {
    WORKSPACES = "workspaces",
    KNOWLEDGE_BASES = "knowledgeBases",
    DOCUMENTS = "documents",
    PAGES = "pages",
    SEARCH_QUERIES_PER_MONTH = "searchQueriesPerMonth",
    TEAM_MEMBERS = "teamMembers",
    CHAT_WITH_DOCS = "chatWithDocs",
    API_ACCESS = "apiAccess",
    SUPPORT = "support"
}