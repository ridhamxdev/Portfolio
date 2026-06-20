import type { Metadata } from "next";
import { Instrument_Serif, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Background from "@/components/Background";
import ScrollProgress from "@/components/ScrollProgress";

const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-ridham-goyals-projects.vercel.app"),
  title: "Ridham Goyal — Full-Stack & Systems Engineer",
  description:
    "Ridham Goyal builds real-time backends, AI decision engines, and shipped full-stack products. A portfolio of systems engineered for throughput, reliability, and scale.",
  keywords: [
    "Ridham Goyal",
    "Full-stack developer",
    "Backend engineer",
    "AI engineer",
    "Next.js",
    "Three.js",
    "portfolio",
  ],
  authors: [{ name: "Ridham Goyal" }],
  openGraph: {
    title: "Ridham Goyal — Full-Stack & Systems Engineer",
    description:
      "Real-time backends, AI decision engines, and shipped full-stack products.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ridham Goyal — Full-Stack & Systems Engineer",
    description:
      "Real-time backends, AI decision engines, and shipped full-stack products.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${hanken.variable} ${jetbrains.variable}`}
    >
      <body className="bg-void text-bone antialiased">
        <Background />
        <Cursor />
        <ScrollProgress />
        <Nav />
        <SmoothScroll>
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
