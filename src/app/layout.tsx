import { Toaster } from "@/components/ui/sonner";
import { TranslationProvider } from "@/providers/i18n-provider";
import { QueryProvider } from "@/providers/query-provider";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI-Powered Claim Orchestrator | MiOX",
  description:
    "Track and manage your insurance claim in real-time with AI-assisted process orchestration.",
  keywords: ["insurance", "claim", "orchestrator", "AI", "dashboard"],
  authors: [{ name: "MiOX Insurance Technologies" }],
  openGraph: {
    title: "AI-Powered Claim Orchestrator",
    description: "Real-time insurance claim tracking with AI assistance.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TranslationProvider>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
