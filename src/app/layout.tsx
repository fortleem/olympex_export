import type { Metadata, Viewport } from "next";
import { Manrope, Fraunces } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Olymp Ex — Egyptian Fresh & Frozen Produce Exporter",
  description:
    "Olymp Ex exports premium Egyptian fresh and frozen fruits and vegetables to importers, distributors and food-service partners worldwide.",
  keywords: [
    "Olymp Ex",
    "Egypt export",
    "fresh produce",
    "IQF frozen",
    "agritrade",
    "Egyptian fruits",
    "Egyptian vegetables",
  ],
  authors: [{ name: "Olymp Ex" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Olymp Ex — Egypt's Harvest, Delivered to the World",
    description:
      "Premium Egyptian fresh and frozen produce for importers, distributors and food-service partners worldwide.",
    siteName: "Olymp Ex",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Olymp Ex — Egyptian Fresh & Frozen Produce Exporter",
    description:
      "Premium Egyptian fresh and frozen produce for importers, distributors and food-service partners worldwide.",
  },
};

export const viewport: Viewport = {
  themeColor: "#2F7D32",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${fraunces.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
