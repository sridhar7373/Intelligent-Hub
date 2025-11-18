"use client";

import OnboardingForm from "@/components/forms/onboarding-form";
import { Button } from "@/components/ui/button";
import { withAuth } from "@/hoc/withAuth";
import { useUserStore } from "@/store/user-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function OnboardingPage() {
    const { user } = useUserStore();
    const router = useRouter();
    useEffect(() => {
        if (user && user.onboarded) {
            router.replace(`/kb/${user?.kb?.id}`); 
        }
    }, [user, router]);

    // Optional: while checking user state, show nothing or loader
    if (!user) {
        return null;
    }
    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-background p-4">
            <div className="flex justify-between w-full">
                <h1 className="">KnowAI</h1>
                <Button size="sm" asChild>
                    <Link href="/logout">Logout</Link>
                </Button>
            </div>
            <div className="w-full max-w-[400px]">
                <div className="w-full space-y-8 light">
                    <OnboardingForm email={user?.email} />
                </div>
            </div>
        </div>
    )
}

export default withAuth(OnboardingPage);