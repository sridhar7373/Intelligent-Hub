"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/useMe";
import { Loader2 } from "lucide-react";
import { User } from "@/types/user";
import LoadingScreen from "@/components/loading-screen";

export interface WithAuthProps 
{
    user: User
}


export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P & { user: User }>
) {
    return function AuthenticatedComponent(props: P) {
        const router = useRouter();
        const { user, loading, authenticated } = useMe();

        useEffect(() => {
            if (loading) return;

            if (!authenticated) {
                router.replace("/login");
                return;
            }

            if (user && !user.onboarded) {
                router.replace(`/onboarding`);
                return;
            }
        }, [loading, authenticated, user, router]);

        if (loading || !authenticated || !user) {
            return <LoadingScreen />;
        }

        return <WrappedComponent {...props} user={user} />;
    };
}
