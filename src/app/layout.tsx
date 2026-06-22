import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Wedding Planner Dashboard",
  description: "Pantau pengeluaran pernikahan — input via WhatsApp, lihat di dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-ivory antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
