import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";

const display = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700", "800"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: site.metaTitle,
  description: site.metaDescription,
  openGraph: {
    title: site.metaTitle,
    description: site.metaDescription,
    images: [site.photo.src],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
