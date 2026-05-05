import type { Metadata } from "next";
import { Newsreader, Work_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { supportedLanguages, t } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/request-language";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getRequestLanguage();
  const navItems = [
    { label: t(language, "nav.home"), href: "/" },
    { label: t(language, "nav.about"), href: "/about" },
    { label: t(language, "nav.training"), href: "/programs" },
    { label: t(language, "nav.events"), href: "/events" },
    { label: t(language, "nav.gallery"), href: "/gallery" },
    { label: t(language, "nav.contact"), href: "/contact" },
  ];

  return (
    <html
      lang={language}
      className={`${workSans.variable} ${newsreader.variable} h-full antialiased dark`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <SiteHeader
          currentLanguage={language}
          languageLabel={t(language, "lang.label")}
          languageOptions={supportedLanguages.map((value) => ({
            value,
            label: t(language, `lang.${value}`),
          }))}
          navItems={navItems}
          adminLabel={t(language, "nav.admin")}
          techCenterLabel={t(language, "header.techCenter")}
        />
        <main className="flex-1">{children}</main>
        <SiteFooter language={language} />
      </body>
    </html>
  );
}
