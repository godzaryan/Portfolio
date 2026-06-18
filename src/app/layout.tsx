import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { portfolioData } from "@/config/portfolio";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://godzaryan.vercel.app"),
  title: `${portfolioData.about.name} | ${portfolioData.about.role}`,
  description: portfolioData.about.bio,
  openGraph: {
    title: `${portfolioData.about.name} | DEVIL OS`,
    description: portfolioData.about.bio,
    url: "https://godzaryan.vercel.app",
    siteName: "DEVIL OS Terminal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${portfolioData.about.name} | DEVIL OS`,
    description: portfolioData.about.bio,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
