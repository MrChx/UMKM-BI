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

export const metadata: Metadata = {
  title: "Isi Torang Gorontalo - Direktori Digital UMKM, Wisata, & Jasa",
  description: "Temukan rasa, karya, dan tempat terbaik di Gorontalo dalam satu klik. Direktori digital UMKM, tempat wisata, kuliner, penginapan, dan jasa lokal Provinsi Gorontalo.",
  keywords: ["Isi Torang Gorontalo", "UMKM Gorontalo", "Wisata Gorontalo", "Kuliner Gorontalo", "Jasa Gorontalo", "Direktori Digital Gorontalo"],
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
      </head>
      <body className="bg-background text-on-background antialiased font-sans text-base min-h-screen flex flex-col">
        <UmkmProvider>{children}</UmkmProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
