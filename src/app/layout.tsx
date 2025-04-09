import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "@/providers/AuthProvider";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "../providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StudyLens - Track Your Study Performance",
  description: "Analyze and improve your study habits with StudyLens",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-full flex flex-col bg-white dark:bg-gray-900">
              <Navbar />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
                {children}
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
