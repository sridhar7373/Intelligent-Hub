"use client";

import Link from "next/link";
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { type LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
}

export function NavMain({ items }: { items: MenuItem[] }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={item.isActive}
            >
              <Link href={item.url}>
                <item.icon className="size-4" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
