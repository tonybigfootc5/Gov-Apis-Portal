import type { Metadata } from "next";
import { Newsreader, Work_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.apiculture.in"),
  title: {
    default: "API CULTURE Technology Center",
    template: "%s | API CULTURE",
  },
  description:
    "Government-grade apiculture training, technology, events, and institutional support from API CULTURE Technology Center, Hyderabad.",
  openGraph: {
    title: "API CULTURE Technology Center",
    description:
      "Apiculture culture, beekeeping training, and rural enterprise technology center in Hyderabad.",
    url: "/",
    siteName: "API CULTURE",
    images: [{ url: "/honey-house-signboard.jpg", width: 1000, height: 563 }],
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
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
      className={`${workSans.variable} ${newsreader.variable} h-full antialiased dark`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
