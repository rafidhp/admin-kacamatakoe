import "@/styles/globals.css";

import { AuthSessionProvider } from "@/components/providers/session-provider";
import { type Metadata } from "next";
import { Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "KacamataKoe",
  description: "KacamataKoe admin page",
  icons: [{ rel: "icon", url: "/logos/logo-dark-frame-bg.png" }],
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="font-sans">
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
