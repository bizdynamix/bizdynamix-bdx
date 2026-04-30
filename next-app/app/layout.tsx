import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "../styles/globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BizDynamix — Digital Growth Agency | Cape Town",
  description:
    "Cape Town's full-service digital agency. Web design, app development, business automation, AI systems, SEO, and more. 10+ years growing South African businesses online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
