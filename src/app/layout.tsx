import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SparklesBackground from "@/components/SparklesBackground";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconUser, IconBriefcase } from "@tabler/icons-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ridham Goyal | Portfolio",
  description: "Personal portfolio website showcasing my projects and skills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = [
    { name: "Home", link: "/", icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" /> },
    { name: "Projects", link: "/projects", icon: <IconBriefcase className="h-4 w-4 text-neutral-500 dark:text-white" /> },
    { name: "About", link: "/about", icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" /> },
  ];

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SparklesBackground />
        <FloatingNav navItems={navItems} />
        {children}
      </body>
    </html>
  );
}
