"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-surface border-b border-outline-variant shadow-sm top-0 sticky z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-20">
        <Link href="/" className="flex items-center gap-3.5 group">
          <img
            src="/logo.png"
            alt="Logo Thrive GenBI UBMG"
            className="w-12 h-12 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
          />
          <span className="text-xl md:text-2xl font-display font-extrabold text-primary tracking-tight group-hover:text-primary/80 transition-colors">
            Isi Torang Gorontalo
          </span>
        </Link>

        <nav className="hidden md:flex gap-8 items-center">
          <Link
            className="text-primary font-medium border-b-2 border-primary pb-1 text-sm tracking-wide transition-all"
            href="/"
          >
            Beranda
          </Link>
          <Link
            className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium tracking-wide"
            href="#kategori"
          >
            Kategori
          </Link>
          <Link
            className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium tracking-wide"
            href="#tentang"
          >
            Tentang
          </Link>
          <Link
            className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium tracking-wide"
            href="#daftar"
          >
            Daftar Bisnis
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-primary p-2 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant bg-surface px-margin-mobile py-4 flex flex-col gap-4 shadow-lg">
          <Link
            onClick={() => setMobileMenuOpen(false)}
            className="text-primary font-medium text-base py-1"
            href="/"
          >
            Beranda
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            className="text-on-surface-variant hover:text-primary transition-colors text-base py-1 font-medium"
            href="#kategori"
          >
            Kategori
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            className="text-on-surface-variant hover:text-primary transition-colors text-base py-1 font-medium"
            href="#tentang"
          >
            Tentang
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            className="text-on-surface-variant hover:text-primary transition-colors text-base py-1 font-medium"
            href="#daftar"
          >
            Daftar Bisnis
          </Link>
        </div>
      )}
    </header>
  );
}
