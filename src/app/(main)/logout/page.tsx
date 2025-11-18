"use client";

import { useEffect } from "react";
import { withAuth } from "@/hoc/withAuth";
import { useLogout } from "@/hooks/useLogout";
import { useRouter } from "next/navigation";

function LogoutPage() {
    const router = useRouter();
    const { trigger: logout, isMutating } = useLogout();

    useEffect(() => {
        async function doLogout() {
            try 
            {
                await logout();
            } 
            finally 
            {
                window.location.href = "/login";
            }
        }

        doLogout();
    }, [logout]);

    return null; // no UI needed
}

export default withAuth(LogoutPage);
