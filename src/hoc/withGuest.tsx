"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/useMe";
import { Loader2 } from "lucide-react";
import LoadingScreen from "@/components/loading-screen";

export function withGuest<P extends object>(
    WrappedComponent: React.ComponentType<P>
) {
    return function GuestOnlyComponent(props: P) {
        const router = useRouter();
        const { user, loading, authenticated } = useMe();

        useEffect(() => {
            if (loading) return;
            if (authenticated) {
                if (!user?.onboarded) {
                    router.replace(`/onboarding`);
                    return;
                }
                router.replace(`/kb/${user?.kb?.id}`);
                return;
            }

        }, [loading, authenticated, user, router]);

        if (loading) {
            return <LoadingScreen />;
        }

        // User NOT authenticated → show the guest page
        return <WrappedComponent {...props} />;
    };
}
