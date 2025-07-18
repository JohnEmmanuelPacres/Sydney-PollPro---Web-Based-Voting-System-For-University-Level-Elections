import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppClientLayout from "./AppClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UniVote",
  description: "Join the polls now WildCats!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`h-full ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <link rel="icon" href="/logo.ico" />
      </head>
      <body>
        <AppClientLayout>{children}</AppClientLayout>
      </body>
    </html>
  );
}