import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AppShell from "@/components/layout/AppShell";
import { COLLEGE, HACKATHON, HACKATHON_ENDED, HACKATHON_ENDED_DATE } from "@/lib/constants";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: HACKATHON_ENDED
      ? `${HACKATHON.name} — Concluded Successfully | ${COLLEGE.shortName}`
      : `${HACKATHON.name} | ${COLLEGE.shortName}`,
    template: `%s | iSIH 2026 — ${COLLEGE.shortName}`,
  },
  description: HACKATHON_ENDED
    ? `The Internal Smart India Hackathon 2026 at ${COLLEGE.name} concluded successfully on ${HACKATHON_ENDED_DATE}. Review of projects and nominations for SIH 2026 national round are in progress.`
    : `Register your team for the Internal Smart India Hackathon 2026 hosted by ${COLLEGE.name} in association with IQAC. Top teams will represent SXC at Smart India Hackathon 2026.`,
  keywords: [
    "Smart India Hackathon",
    "SIH 2026",
    "Hackathon Concluded",
    "Hackathon Ended",
    "St. Xavier's College Ranchi",
    "IQAC",
    "Internal Hackathon",
    "Team Registration",
    "Innovation",
    "SXC Ranchi",
  ],
  authors: [{ name: "St. Xavier's College, Ranchi — Innovation Cell" }],
  creator: "SXC Ranchi IQAC",
  icons: {
    icon: "/api/image",
    apple: "/api/image",
    shortcut: "/api/image",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://isih2026.sxcranchi.ac.in",
    siteName: "iSIH 2026 — St. Xavier's College, Ranchi",
    title: "Internal SIH 2026 | St. Xavier's College, Ranchi",
    description:
      "Register your team for the Internal Smart India Hackathon 2026. Build innovative solutions. Represent SXC at SIH 2026.",
    images: [
      {
        url: "/api/image",
        width: 1200,
        height: 630,
        alt: "Internal SIH 2026 at St. Xavier's College Ranchi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Internal SIH 2026 | St. Xavier's College, Ranchi",
    description:
      "Register your team for the Internal Smart India Hackathon 2026 at SXC Ranchi.",
    images: ["/api/image"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-background text-text-primary">
        <AppShell>{children}</AppShell>
        <Toaster
          position="top-right"
          richColors
          expand={false}
          duration={4000}
          toastOptions={{
            style: {
              fontFamily: "Inter, sans-serif",
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}
