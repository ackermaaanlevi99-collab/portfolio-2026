import type { Metadata } from "next";
import { Big_Shoulders_Display } from "next/font/google";

const bigShoulders = Big_Shoulders_Display({
  subsets: ["latin"],
});
const bigShoulders = Big_Shoulders_Display({
  subsets: ["latin"],
});
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Cursor from "@/components/layout/Cursor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Transition from "@/components/layout/Transition";
import texts from "@/content/texts.json";
import contact from "@/content/contact.json";
import siteConfig from "@/config/site";

const display = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: texts.meta.titleDefault,
    template: texts.meta.titleTemplate,
  },
  description: texts.meta.description,
  keywords: texts.meta.keywords,
  openGraph: {
    title: texts.meta.titleDefault,
    description: texts.meta.description,
    url: siteConfig.url,
    siteName: texts.brand.name,
    locale: "es_VE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: texts.meta.titleDefault,
    description: texts.meta.description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: texts.brand.name,
  description: texts.meta.description,
  url: siteConfig.url,
  email: contact.email,
  areaServed: "VE",
  sameAs: [contact.behance],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="overflow-x-hidden font-body antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <SmoothScroll>
          <Cursor />
          <Navbar />
          <Transition>
            <main id="main-content">{children}</main>
          </Transition>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
