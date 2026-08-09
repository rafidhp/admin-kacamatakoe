"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationLoader } from "@/components/app-layout/navigation-loader";
import {
  Home,
  Package,
  Settings,
  Glasses,
  Blocks,
} from "lucide-react";
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Kacamata",
    url: "/dashboard/glasses",
    icon: Glasses,
  },
  {
    title: "Produk Lainnya",
    url: "/dashboard/other-products",
    icon: Blocks,
  },
  {
    title: "Produk",
    url: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function NavMain() {
    const pathname = usePathname();
    const { startLoading } = useNavigationLoader();

    return (
        <SidebarMenu className="flex flex-col p-1">
            <SidebarGroupLabel className="pb-0 mb-0">Platform</SidebarGroupLabel>
            {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                    <SidebarMenuItem key={item.title}>
                        <Link
                            href={item.url}
                            onClick={() => {
                              if (pathname !== item.url) {
                                startLoading();
                              }
                            }}
                            className="flex items-center gap-2"
                        >
                            <SidebarMenuButton
                                isActive={isActive}
                                className={`
                                    h-10 cursor-pointer
                                    ${isActive
                                        ? "bg-mist-800! text-white! hover:bg-black hover:text-white shadow"
                                        : "hover:bg-zinc-100! transition"
                                    }
                                `}
                            >
                                <item.icon className="size-6 pb-0.5" />
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );
}