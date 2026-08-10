import { type Metadata } from "next";
import AppLayout from "@/layouts/app-layout";
import { Toaster } from "@/components/ui/sonner";
import { BreadcrumbProvider } from "@/components/providers/breadcrumb-provider";

export const metadata: Metadata = {
  title: "Dashboard | KacamataKoe",
  description: "KacamataKoe admin page",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <BreadcrumbProvider>
      <AppLayout>
        <Toaster
          position='top-right'
          theme='light'
        />
        {children}
      </AppLayout>
    </BreadcrumbProvider>
  );
}
