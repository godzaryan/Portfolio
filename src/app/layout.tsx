import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { portfolioData } from "@/config/portfolio";
import { SecurityShield } from "@/components/effects/SecurityShield";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://godzaryan.vercel.app"),
  title: `${portfolioData.about.name} | ${portfolioData.about.role}`,
  description: portfolioData.about.bio,
  openGraph: {
    title: `${portfolioData.about.name} | DEVIL OS`,
    description: portfolioData.about.bio,
    url: "https://godzaryan.vercel.app",
    siteName: "DEVIL OS Terminal",
    images: [
      {
        url: "https://godzaryan.vercel.app/matrix_avatar_v2.png",
        width: 500,
        height: 500,
        alt: "DEVIL OS Cyber Avatar",
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${portfolioData.about.name} | DEVIL OS`,
    description: portfolioData.about.bio,
    images: ["https://godzaryan.vercel.app/matrix_avatar_v2.png"],
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
      <body className="min-h-full flex flex-col">
        <SecurityShield />
        {children}
      </body>
    </html>
  );
}
