"use client";

import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "@/components/providers/breadcrumb-provider";

export function AppHeader() {
  const { breadcrumbs } = useBreadcrumb();

  return (
    <header className="sticky top-0 z-20 flex h-[7vh] items-center border-b bg-white px-6">
      <SidebarTrigger className="cursor-pointer" />

      <div className="ml-2">
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => {
                const isLast =
                  index === breadcrumbs.length - 1;

                return (
                  <div
                    key={`${item.title}-${index}`}
                    className="flex items-center"
                  >
                    <BreadcrumbItem>
                      {isLast || !item.href ? (
                        <BreadcrumbPage>
                          {item.title}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink>
                          <Link href={item.href}>
                            {item.title}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>

                    {!isLast && <BreadcrumbSeparator />}
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
    </header>
  );
}
