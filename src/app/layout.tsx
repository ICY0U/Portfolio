import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ICU | Developer Portfolio",
  description: "Interactive terminal portfolio by ICU. Games, tools, and creative coding projects. Built with Next.js.",
  keywords: ["developer", "portfolio", "terminal", "C++", "TypeScript", "game dev", "ICU"],
  authors: [{ name: "ICU" }],
  openGraph: {
    title: "ICU | Developer Portfolio",
    description: "Interactive terminal portfolio. Games, tools, and creative coding.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ICU | Developer Portfolio",
    description: "Interactive terminal portfolio. Games, tools, and creative coding.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jetbrains.variable} ${jetbrains.className}`}>
      <body className="bg-black text-green-400 antialiased">
        {children}
      </body>
    </html>
  );
}
