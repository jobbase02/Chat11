import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "chat11 - Copy-paste AI for your website",
  description: "chat11 ingests your FAQs, docs, and website content. In seconds, it generates a custom AI widget you can embed anywhere with one line of code.",
  
  // Ye browser tab ke favicon ke liye hai
  icons: {
    icon: "/icon.png", 
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  // Ye WhatsApp, Facebook, LinkedIn previews ke liye hai
  openGraph: {
    title: "chat11 | Copy-paste AI for your website",
    description: "Your website needs an AI. We made it copy-paste simple. Train on your data and deploy in minutes.",
    url: "https://chat11.cdn.elevenxsolutions.com", // Yahan apni actual site ka URL daal dena
    siteName: "chat11",
    images: [
      {
        url: "/icon.png", // Public folder mein rakhi hui image ka path
        width: 800,
        height: 800,
        alt: "chat11 Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Ye Twitter/X link previews ke liye hai
  twitter: {
    card: "summary", // 'summary' square logo ke liye best hai. Badi image ke liye 'summary_large_image' use karte hain.
    title: "chat11 | Copy-paste AI for your website",
    description: "Your website needs an AI. We made it copy-paste simple.",
    images: ["/icon.png"], 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
