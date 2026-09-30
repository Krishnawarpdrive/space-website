import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { SiteShell } from "@/components/sites/hellocopilot-com-bce9a408/shared/SiteShell";
import "./globals.css";

const rustea = localFont({
  src: "./fonts/Rustea.otf",
  variable: "--font-rustea",
  display: "swap",
});

const aeonik = localFont({
  src: "./fonts/Aeonik.otf",
  variable: "--font-aeonik",
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ICONS = "/sites/hellocopilot-com-bce9a408/shared/uploads/fbrfg";
const DESCRIPTION =
  "Ready to lift of? Discover 'Take Off' for a creative boost, glide with 'Touch Down' for ultimate relaxation, or chill at 'High Point' for the perfect blend of both. To infinity and beyond!";

export const metadata: Metadata = {
  title: "Copilot • To Infinity & Beyond",
  description: DESCRIPTION,
  icons: {
    icon: [
      { url: `${ICONS}/favicon-96x96.png`, sizes: "96x96", type: "image/png" },
      { url: `${ICONS}/favicon.svg`, type: "image/svg+xml" },
    ],
    shortcut: `${ICONS}/favicon.ico`,
    apple: { url: `${ICONS}/apple-touch-icon.png`, sizes: "180x180" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Copilot",
    title: "Copilot • To Infinity & Beyond",
    description: DESCRIPTION,
    images: [
      {
        url: "/sites/hellocopilot-com-bce9a408/shared/uploads/2025/02/og-new.jpg",
        width: 1400,
        height: 788,
        type: "image/jpeg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rustea.variable} ${aeonik.variable} ${manrope.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
