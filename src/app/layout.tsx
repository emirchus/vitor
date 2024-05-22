import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { fontSans } from "@/lib/fonts";

import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  authors: [
    {
      name: "emirchus",
      url: "https://emirchus.dev.ar"
    }
  ],
  creator: "emirchus",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@emirchus"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
