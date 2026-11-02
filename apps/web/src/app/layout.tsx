import type { Metadata, Viewport } from "next";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hair2harvest.ph"),
  title: {
    default: "Hair2Harvest — Soil from salons",
    template: "%s · Hair2Harvest",
  },
  description:
    "Hair2Harvest collects human hair from barbershops on the shop's own schedule, grades it at the door, and turns it into compost with a lab result behind every batch.",
  keywords: [
    "hair compost",
    "barbershop waste",
    "hair2harvest",
    "organic fertilizer",
    "circular economy Philippines",
    "Bataan",
  ],
  authors: [{ name: "Ryan Cepeda Domer" }],
  openGraph: {
    title: "Hair2Harvest — Soil from salons",
    description:
      "Every haircut leaves something behind. We collect it, grade it, and turn it into compost — without asking a single barber to change their day.",
    type: "website",
    locale: "en_PH",
    siteName: "Hair2Harvest",
  },
  icons: {
    icon: [{ url: "/brand/h2h-mark-64.png", sizes: "64x64", type: "image/png" }],
    apple: [{ url: "/brand/h2h-mark-128.png", sizes: "128x128" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f2e6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PH">
      <body>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
