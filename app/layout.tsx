import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from 'sonner';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'WIFT Africa - Join Africa\'s Premier Network for Women in Film & TV',
  description: 'Connect with 300+ verified professionals across 10 countries. Join the community that champions women\'s voices in African storytelling.',
  keywords: ['WIFT Africa', 'women in film', 'African cinema', 'film industry', 'television', 'media professionals', 'networking'],
  openGraph: {
    title: 'WIFT Africa - Women in Film, Television & Media',
    description: 'Join Africa\'s premier network for women in film, television & media. Connect, collaborate, and grow with verified professionals.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WIFT Africa - Women in Film, Television & Media',
    description: 'Join Africa\'s premier network for women in film, television & media.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
