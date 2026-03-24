// ─── Root Layout ─────────────────────────────────────────────────────────────
// Provides global styles, fonts, and persistent UI shells (Navbar, Footer)
//
// Security headers must be implemented in next.config.js in production:
// - Content-Security-Policy
// - X-Frame-Options: DENY
// - X-Content-Type-Options: nosniff
// - Referrer-Policy: strict-origin-when-cross-origin
// - Permissions-Policy
// See: https://nextjs.org/docs/app/api-reference/next-config-js/headers

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
    "Order fresh flowers, roses, bouquets and luxury arrangements from 500+ verified flower shops across India. Same-day delivery guaranteed.",

  keywords: [
    "flower delivery",
    "fresh flowers",
    "bouquets online",
    "roses delivery India",
    "flower shops near me",
    "same day flowers",
  ],

  openGraph: {
    title: "EventSpace — India's Flower Delivery Marketplace",
    description:
      "Order fresh flowers for birthdays, anniversaries, weddings, and everyday gifting. Same-day delivery.",
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

        {/*
          Inspect Protection (UX Only — Part 8)
          This does NOT prevent real inspection. For UX deterrence only.
          Disables right-click and text selection on elements with data-protected attribute.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // This does NOT prevent real inspection. For UX deterrence only.
              document.addEventListener('contextmenu', function(e) {
                if (e.target && e.target.closest && e.target.closest('[data-protected]')) {
                  e.preventDefault();
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}