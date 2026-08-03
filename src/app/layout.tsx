import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import Preloader from "@/components/system/Preloader";
import { ThemeProvider, themeNoFlashScript } from "@/components/theme/ThemeProvider";

// Repeat visitors and reduced-motion users never see the intro sheet, even
// before hydration (the sheet is server-rendered so first visits paint it).
const introNoFlashScript = `(function(){try{if(sessionStorage.getItem('ledger-intro-seen')==='1'||window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('intro-seen');}}catch(e){}})();`;

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  axes: ["wdth"],
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
      data-theme="light"
      suppressHydrationWarning
      className={`${archivo.variable} ${jetbrains.variable}`}
    >
      <body className="bg-bg text-ink antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeNoFlashScript }} />
        <script dangerouslySetInnerHTML={{ __html: introNoFlashScript }} />
        {/* Content must survive without JS: undo the reveal system's hidden states */}
        <noscript>
          <style>{`.rv-mask,.rv-rise,.rv-fade,.rv-rule,.rv-curtain,.rv-tick{clip-path:none!important;transform:none!important;opacity:1!important}.intro-sheet{display:none!important}`}</style>
        </noscript>
        <ThemeProvider>
          <Preloader />
          <Cursor />
          <ScrollProgress />
          <Nav />
          <SmoothScroll>
            {children}
            <Footer />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
