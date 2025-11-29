"use client"

import * as React from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar";
import { BotIcon, Command, Database } from "lucide-react";
import { MenuItem, NavMain } from "./nav-main";
import { User } from "@/types/user";
import { NavUser } from "./nav-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";


export function AppSidebar({ user, ...props }: {  user: User } &React.ComponentProps<typeof Sidebar>) {

    const baseId = user?.kb?.id;

    const navMain: MenuItem[] = [
        {
            title: "Knowledge Base",
            url: `/kb/${baseId}`,
            icon: Database,
            isActive: true,
        },
        {
            title: "Ask AI",
            url: `/kb/${baseId}/chat`,
            icon: BotIcon,
            isActive: false,
        },
    ];

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">Acme Inc</span>
                                    <span className="truncate text-xs">Enterprise</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                {user.plan.id === "free" && (
                    <Card className="p-4 shadow-none border rounded-xl space-y-4">
                        <CardHeader className="p-0 space-y-1">
                            <CardTitle className="text-base font-medium">
                            Upgrade Plan
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                            Unlock premium features & higher limits.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-0">
                            <Button size="sm" className="w-full" asChild>
                            <a href="/upgrade">Upgrade Plan</a>
                            </Button>
                        </CardContent>
                    </Card>
                )}
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}