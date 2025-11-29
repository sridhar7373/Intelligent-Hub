import prisma from "@/lib/prisma";
import { FREE_PLAN, PLAN_MAP } from "./constonts";
import { Feature, FeatureKey } from "@/types/plan";

export class SubscriptionService {
    static async getWorkspacePlan(workspaceId: string) {
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { userId: true }
        });

        if (!workspace) return FREE_PLAN;

        return this.getUserPlan(workspace.userId);
    }

    static async getUserPlan(userId: string) {
        const sub = await prisma.subscription.findFirst({
            where: {
                userId,
                status: "ACTIVE",
                endDate: { gte: new Date() }
            },
        });
        const planId = sub?.planId || "free";
        return PLAN_MAP[planId] || FREE_PLAN;
    }

    static async getFeatures(workspaceId: string) {
        const plan = await this.getWorkspacePlan(workspaceId);
        return plan.features as Feature;
    }

    static async hasFeature(workspaceId: string, feature: FeatureKey) {
        const features = await this.getFeatures(workspaceId);
        return Boolean(features[feature]);
    }

    static async getFeatureValue(workspaceId: string, feature: FeatureKey) {
        const features = await this.getFeatures(workspaceId);
        return Number(features[feature]) || 0;
    }
}