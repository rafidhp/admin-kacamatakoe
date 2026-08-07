"use client";

import Image from "next/image";
import { UserRound, ChevronsUpDown, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

export function NavUser() {
    const session = useSession();
    const { state } = useSidebar();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                        <SidebarMenuButton
                            size="lg"
                            className="
                                h-14
                                cursor-pointer
                                transition
                                hover:bg-zinc-100!
                                data-[state=open]:bg-zinc-100
                            "
                        >
                            {session.data?.user.image ? (
                                <Image
                                    src={session.data.user.image}
                                    alt={
                                        session.data.user.name ??
                                        "User"
                                    }
                                    width={36}
                                    height={36}
                                    className="shrink-0 rounded-full"
                                />
                            ) : (
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/70">
                                    <UserRound className="size-6!" />
                                </div>
                            )}

                            <div className="flex min-w-0 flex-1 flex-col text-left">
                                <span className="truncate font-medium">
                                    {session.data?.user.name}
                                </span>

                                <span className="truncate text-xs text-muted-foreground">
                                    {session.data?.user.email}
                                </span>
                            </div>

                            <ChevronsUpDown className="ml-auto size-4 shrink-0" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg font-[poppins]"
                        align="center"
                        side={
                            state === "collapsed"
                                ? "left"
                                : "bottom"
                        }
                    >
                        <div className="p-2">
                            <div className="text-sm font-medium">
                                {session.data?.user.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {session.data?.user.email}
                            </div>
                            <div className="text-base mt-2">
                                <Button
                                    onClick={() =>
                                        signOut({
                                            redirectTo: "/",
                                        })
                                    }
                                    className='
                                        w-full flex
                                        items-center justify-start
                                        gap-2 py-1!
                                        rounded-sm cursor-pointer
                                        border border-red-500/50
                                        bg-red-500/10 hover:bg-red-500/30
                                        text-red-500 transition
                                    '
                                >
                                    <LogOut />
                                    Keluar
                                </Button>
                            </div>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}