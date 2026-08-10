import { type Metadata } from "next";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/layouts/app-layout";
import { Toaster } from "@/components/ui/sonner";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
]

export const metadata: Metadata = {
  title: "Dashboard | KacamataKoe",
  description: "KacamataKoe admin page",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Toaster
        position='top-right'
        theme='light'
      />
      {children}
    </AppLayout>
  );
}
