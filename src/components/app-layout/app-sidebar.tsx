"use client";

import Image from "next/image";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/app-layout/nav-main";
import { NavUser } from "@/components/app-layout/nav-user";

export function AppSidebar() {
    const { state } = useSidebar();
    const collapsed = state === "collapsed";

    return (
        <Sidebar
            collapsible="icon"
            className="border-r border-zinc-200 bg-white font-[poppins]"
        >
            <SidebarHeader className="flex items-center">
                {collapsed ? (
                    <Image
                        src="/logos/logo-dark.png"
                        alt="Kacamatakoe Logo"
                        width={36}
                        height={36}
                    />
                ) : (
                    <Image
                        src="/logos/logo-dark-full.png"
                        alt="Kacamatakoe Logo"
                        width={180}
                        height={40}
                        className="mb-2"
                    />
                )}
            </SidebarHeader>

            <SidebarContent>
                <NavMain />
            </SidebarContent>

            <SidebarFooter className="border-t">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}