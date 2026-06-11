import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Nav from "./component/nav/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Diksyonè Kreyòl — Ajoute mo",
  description:
    "Espas kontribitè Diksyonè Kreyòl la: ajoute, modifye epi apwouve mo kreyòl ayisyen.",
  // Contributor tool: keep it out of search engines so the main
  // dictionary (diksyonekreyol.org) is the only site that ranks.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ht"
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable}`}
    >
      <body className="antialiased">
        <Nav />
        {children}
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
