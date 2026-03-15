// ─── Root Layout ─────────────────────────────────────────────────────────────
// Provides global styles, fonts, and persistent UI shells (Navbar, Footer)

import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingNav } from "@/components/layout/FloatingNav";
import "@/styles/globals.css";
/* ───────────────── Metadata ───────────────── */

export const metadata: Metadata = {
  metadataBase: new URL("https://eventspace.in"),

  title: {
    default: "EventSpace — India's Event Services Marketplace",
    template: "%s | EventSpace",
  },

  description:
    "Discover and book 2,000+ verified event vendors across India. Venues, photographers, caterers, decorators, DJs, cake artists & makeup professionals.",

  keywords: [
    "event vendors",
    "wedding vendors",
    "event planning",
    "caterers",
    "photographers",
    "event venues India",
  ],

  openGraph: {
    title: "EventSpace — India's Event Vendor Marketplace",
    description:
      "Find and book trusted vendors for weddings, birthdays, and corporate events.",
    url: "https://eventspace.in",
    siteName: "EventSpace",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "EventSpace",
    description:
      "Find verified vendors for weddings, birthdays, and corporate events.",
  },
};

/* ───────────────── Viewport ───────────────── */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

/* ───────────────── Layout ───────────────── */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Font optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@700;800;900&family=Syne:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="bg-ivory text-obsidian antialiased min-h-screen flex flex-col">

        {/* Navbar */}
        <Navbar />

        {/* Floating back/forward nav */}
        <FloatingNav />

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <Footer />

      </body>
    </html>
  );
}