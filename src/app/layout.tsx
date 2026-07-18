import type { Metadata } from "next";
import { Newsreader, Work_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteMainShell } from "@/components/site-main-shell";
import { isSandboxEnvironment } from "@/lib/app-env";
import { supportedLanguages, t, type SiteLanguage } from "@/lib/i18n";
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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "64x64" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
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
    index: !isSandboxEnvironment(),
    follow: !isSandboxEnvironment(),
  },
};

const sharedNavCopy: Record<
  SiteLanguage,
  {
    articles: string;
    equipment?: string;
    products: string;
    explore: string;
    training: string;
  }
> = {
  en: {
    articles: "Articles",
    equipment: "Equipment",
    products: "Products",
    explore: "Explore",
    training: "Training",
  },
  te: {
    articles: "వ్యాసాలు",
    products: "ఉత్పత్తులు",
    explore: "అన్వేషించండి",
    training: "శిక్షణ",
  },
  hi: {
    articles: "लेख",
    products: "उत्पाद",
    explore: "एक्सप्लोर",
    training: "प्रशिक्षण",
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getRequestLanguage();
  const sandboxMode = isSandboxEnvironment();
  const languageOptions = supportedLanguages.map((value) => ({
    value,
    label: t(language, `lang.${value}`),
  }));
  const navCopy = sharedNavCopy[language];
  const navItems = [
    { label: t(language, "nav.home"), href: "/" },
    { label: t(language, "nav.about"), href: "/about" },
    { label: t(language, "nav.training"), href: "/programs" },
    { label: t(language, "nav.contact"), href: "/contact" },
  ];
  const exploreItems = [
    { label: navCopy.articles, href: "/articles" },
    { label: t(language, "nav.events"), href: "/events" },
    { label: t(language, "nav.gallery"), href: "/gallery" },
    { label: navCopy.equipment ?? "Equipment", href: "/equipment" },
    { label: navCopy.products, href: "/products" },
  ];

  return (
    <html
      lang={language}
      className={`${workSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className={`flex min-h-full flex-col bg-background text-foreground${sandboxMode ? " sandbox-shell" : ""}`}>
        <SiteHeader
          currentLanguage={language}
          languageLabel={t(language, "lang.label")}
          languageOptions={languageOptions}
          navItems={navItems}
          exploreItems={exploreItems}
          trainingLabel={navCopy.training}
          exploreLabel={navCopy.explore}
          techCenterLabel={t(language, "header.techCenter")}
          sandboxMode={sandboxMode}
        />
        <SiteMainShell>{children}</SiteMainShell>
        <SiteFooter
          language={language}
          languageLabel={t(language, "lang.label")}
          languageOptions={languageOptions}
        />
      </body>
    </html>
  );
}
