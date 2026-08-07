import "@/styles/globals.css";

import { type Metadata } from "next";
import { Poppins } from "next/font/google";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/layouts/app-layout";

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

const poppins = Poppins({
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  variable: "--font-poppins",
});

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="font-sans">
        <AppLayout breadcrumbs={breadcrumbs}>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
