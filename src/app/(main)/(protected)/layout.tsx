'use client'
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { withAuth, WithAuthProps } from "@/hoc/withAuth";


function Layout({ user, children }:  WithAuthProps & { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar user={user} />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}

export default withAuth(Layout)