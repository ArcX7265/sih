import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NidhiSetu · Deposit Intelligence",
  description: "A connected security deposit lifecycle. SIH 2026 prototype with synthetic records.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
