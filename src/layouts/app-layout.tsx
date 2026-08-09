import {
  SidebarProvider,
  SidebarInset
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-layout/app-sidebar";
import { AppHeader } from "@/components/app-layout/app-header";
import { NavigationLoaderProvider } from "@/components/app-layout/navigation-loader";

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({
  children,
  breadcrumbs,
}: AppLayoutProps) {
  return (
    <NavigationLoaderProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className="font-[poppins]">
            <AppHeader breadcrumbs={breadcrumbs} />
            <main className="p-6">
              {children}
            </main>
        </SidebarInset>
      </SidebarProvider>
    </NavigationLoaderProvider>
  );
}