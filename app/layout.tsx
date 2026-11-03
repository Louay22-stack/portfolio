import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/layout/TopNav";
import { SideRail } from "@/components/layout/SideRail";
import { Footer } from "@/components/layout/Footer";
import { profile, siteUrl } from "@/content/profile";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const description =
  "Louay Ouhibi, Bioprocess Engineer (Industrial Biology, INSAT). Anaerobic digestion, biogas and fermentation engineering combined with process simulation and machine learning.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Louay Ouhibi · Bioprocess Engineer",
    template: "%s · Louay Ouhibi",
  },
  description,
  keywords: [
    "bioprocess engineer",
    "industrial biology",
    "anaerobic digestion",
    "biogas",
    "biomethane",
    "fermentation",
    "machine learning",
    "process simulation",
    "DWSIM",
    "Louay Ouhibi",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Louay Ouhibi",
    title: "Louay Ouhibi · Bioprocess Engineer",
    description,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#1f272d",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Tunis", addressCountry: "TN" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "National Institute of Applied Sciences and Technology (INSAT)",
  },
  knowsAbout: [
    "Bioprocess engineering",
    "Anaerobic digestion",
    "Biogas",
    "Fermentation",
    "Process simulation",
    "Machine learning",
  ],
  knowsLanguage: ["ar", "fr", "en"],
  sameAs: [profile.linkedin, profile.github],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="grain min-h-dvh">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main"
          className="sr-only z-[70] bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SideRail />
        <TopNav />
        <div className="xl:pl-[var(--rail)]">
          <main id="main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
