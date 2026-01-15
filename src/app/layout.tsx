import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptLens - Reverse Engineer Websites into Prompts",
  description: "Analyze any website and reconstruct the prompts that could have created it. A tool for designers, developers, and prompt engineers.",
  keywords: ["prompt engineering", "reverse engineering", "web design", "AI prompts", "design systems"],
  authors: [{ name: "PromptLens" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "PromptLens",
    description: "Reverse engineer websites into the prompts that created them",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
