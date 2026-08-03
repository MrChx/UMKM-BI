import type { Metadata } from "next";
import { Hanken_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { UmkmProvider } from "@/context/UmkmContext";
import { Toaster } from "react-hot-toast";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const SITE_URL = "https://isitoranggorontalo.web.id";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Isi Torang Gorontalo – Direktori Digital UMKM & Kuliner Gorontalo",
    template: "%s | Isi Torang Gorontalo",
  },
  description:
    "isitoranggorontalo.web.id – Temukan UMKM, kuliner, wisata, penginapan, dan jasa lokal terpercaya di Gorontalo dalam satu klik. Daftarkan bisnis Anda gratis!",
  keywords: [
    "Isi Torang Gorontalo",
    "isitoranggorontalo",
    "isitoranggorontalo.web.id",
    "UMKM Gorontalo",
    "Kuliner Gorontalo",
    "Wisata Gorontalo",
    "Direktori Bisnis Gorontalo",
    "Jasa Gorontalo",
    "Oleh-oleh Gorontalo",
    "Makanan Gorontalo",
    "Usaha Lokal Gorontalo",
    "GenBI Gorontalo",
    "Bank Indonesia Gorontalo",
  ],
  authors: [{ name: "GenBI × Bank Indonesia Gorontalo", url: SITE_URL }],
  creator: "GenBI × Bank Indonesia Gorontalo",
  publisher: "GenBI Gorontalo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "Isi Torang Gorontalo",
    title: "Isi Torang Gorontalo – Direktori Digital UMKM & Kuliner Gorontalo",
    description:
      "Temukan UMKM, kuliner, wisata, dan jasa lokal terpercaya di Gorontalo. Platform direktori digital oleh GenBI × Bank Indonesia Gorontalo.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Isi Torang Gorontalo – Direktori UMKM Gorontalo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Isi Torang Gorontalo – Direktori Digital UMKM Gorontalo",
    description:
      "Temukan UMKM, kuliner, dan wisata lokal terpercaya di Gorontalo.",
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "business directory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${hankenGrotesk.variable} ${plusJakartaSans.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        {/* Structured Data (JSON-LD) for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Isi Torang Gorontalo",
              alternateName: ["isitoranggorontalo", "Isi Torang"],
              url: SITE_URL,
              description:
                "Direktori digital UMKM, kuliner, wisata, dan jasa lokal Provinsi Gorontalo.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "GenBI × Bank Indonesia Gorontalo",
                url: SITE_URL,
              },
            }),
          }}
        />
      </head>
      <body className="bg-background text-on-background antialiased font-sans text-base min-h-screen flex flex-col">
        <UmkmProvider>{children}</UmkmProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
