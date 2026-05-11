import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "StackLens — Free AI Spend Audit",
  description: "Find out exactly where your team is overspending on AI tools in 2 minutes. Free, no login required.",
  openGraph: {
    title: "StackLens — Free AI Spend Audit",
    description: "Find out exactly where your team is overspending on AI tools in 2 minutes.",
    url: "https://stacklens-henna.vercel.app",
    siteName: "StackLens",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackLens — Free AI Spend Audit",
    description: "Find out exactly where your team is overspending on AI tools in 2 minutes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}