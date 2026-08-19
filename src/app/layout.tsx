import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeRegistry from "@/components/ThemeRegistry";
import QueryProvider from "@/components/QueryProvider";
import AppShell from "@/components/AppShell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--app-font",
});

export const metadata: Metadata = {
  title: "Food Recall Traceability Explorer",
  description:
    "Trace a contaminated ingredient through every product and store it reached, and find allergens hidden layers deep in a recipe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ThemeRegistry>
          <QueryProvider>
            <AppShell>{children}</AppShell>
          </QueryProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
