import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "BDX AI Starter",
  description: "Starter Next.js + MERT site with AI chatbot integration."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
