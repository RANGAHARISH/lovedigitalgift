import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter/index.css";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "whishmydear.com - Create Beautiful Interactive Gift Websites",
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Create personalized digital gifts for any occasion - birthdays, anniversaries, weddings, valentines, and more. Interactive templates with photos, music, and custom messages.",
  keywords: [
    "digital gift",
    "interactive gift website",
    "personalized digital gift",
    "birthday gift website",
    "anniversary gift",
    "wedding gift",
    "graduation gift",
    "valentine gift",
    "christmas gift",
    "digital gift maker",
    "custom gift website",
    "online gift creator",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "whishmydear.com - Create Beautiful Interactive Gift Websites",
    description:
      "Create personalized digital gifts for any occasion. Interactive templates with photos, music, and custom messages.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "whishmydear.com - Create Beautiful Interactive Gift Websites",
    description: "Interactive digital gifts with photos, music and a message that lasts.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#D7263D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
