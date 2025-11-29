import { Plan } from "@/types/plan";


export const FREE_PLAN: Plan = {
    id: "free",
    name: "Free",
    price: 0,
    features: {
        workspaces: 1,
        knowledgeBases: 1,
        documents: 10,
        pages: 100,
        searchQueriesPerMonth: 100,
        teamMembers: 1,
        chatWithDocs: false,
        apiAccess: false,
        support: "Community",
    },
};

export const PREMIUM_PLAN: Plan = {
    id: "premium",
    name: "Premium",
    price: 399,
    features: {
        workspaces: 1,
        knowledgeBases: 5,
        documents: 200,
        pages: 5000,
        searchQueriesPerMonth: 2000,
        teamMembers: 3,
        chatWithDocs: true,
        apiAccess: true,
        support: "Standard",
    },
};

export const PRO_PLAN: Plan = {
    id: "pro",
    name: "Pro",
    price: 999,
    features: {
        workspaces: 3,
        knowledgeBases: 20,
        documents: 1000,
        pages: 25000,
        searchQueriesPerMonth: 10000,
        teamMembers: 10,
        chatWithDocs: true,
        apiAccess: true,
        support: "Priority",
    },
};

export const PLAN_MAP: Record<string, Plan> = {
    free: FREE_PLAN,
    premium: PREMIUM_PLAN,
    pro: PRO_PLAN,
};

