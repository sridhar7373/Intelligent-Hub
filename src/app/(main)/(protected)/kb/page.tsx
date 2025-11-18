'use client'
import LoadingScreen from "@/components/loading-screen";
import { withAuth, WithAuthProps } from "@/hoc/withAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


function KBPage({ user }: WithAuthProps) {
    const router = useRouter();

    useEffect(() => {
        if (!user) return;
        if (!user.onboarded) {
            router.replace("/onboarding");
        }
        else if (!user.workspace) {
            router.replace("/onboarding");
        }
        else if (!user.kb) {
            router.replace("/onboarding");
        }
        else
        {
            router.replace(`/kb/${user.kb.id}`);
        }
    },[user, router])

    if (!user) {
        return <LoadingScreen />;
    }
    return null;
}

export default withAuth(KBPage);