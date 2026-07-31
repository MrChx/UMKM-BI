"use client";

import { useEffect, useState, type FormEvent } from "react";

interface HeroProps {
  onSearch?: (query: string) => void;
}

const beforeBrand = "Rasa dan karya ";
const brandText = "UMKM Gorontalo";
const afterBrand = ", satu klik dari mana saja.";
const typewriterText = `${beforeBrand}${brandText}${afterBrand}`;

export default function Hero({ onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typedLength, setTypedLength] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isDeleting && typedLength === typewriterText.length) {
      const pause = window.setTimeout(() => setIsDeleting(true), 1800);
      return () => window.clearTimeout(pause);
    }

    if (isDeleting && typedLength === 0) {
      const pause = window.setTimeout(() => setIsDeleting(false), 500);
      return () => window.clearTimeout(pause);
    }

    const timer = window.setTimeout(
      () => setTypedLength((length) => length + (isDeleting ? -1 : 1)),
      isDeleting ? 35 : 75
    );

    return () => window.clearTimeout(timer);
  }, [isDeleting, typedLength]);

  const visibleText = typewriterText.slice(0, typedLength);
  const visibleBefore = visibleText.slice(0, beforeBrand.length);
  const visibleBrand = visibleText.slice(
    beforeBrand.length,
    beforeBrand.length + brandText.length
  );
  const visibleAfter = visibleText.slice(beforeBrand.length + brandText.length);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <section
      className="relative min-h-[420px] py-16 w-full bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/75 mix-blend-multiply"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-primary/80"></div>

      <div className="relative z-10 w-full max-w-3xl px-margin-mobile md:px-margin-desktop text-center">
        {/* Badge / Tagline */}
        <div className="inline-flex items-center justify-center gap-2 text-xs md:text-sm font-semibold text-secondary uppercase tracking-widest mb-4">
          <span className="w-4 h-[2px] bg-secondary inline-block"></span>
          GENBI × BANK INDONESIA GORONTALO
        </div>

        {/* Main Heading */}
        <h1
          aria-label={typewriterText}
          className="text-3xl md:text-5xl font-display text-white mb-4 tracking-tight font-bold leading-tight min-h-[8.75rem] sm:min-h-[7rem] md:min-h-[7.5rem]"
        >
          <span aria-hidden="true">
            {visibleBefore}
            {visibleBrand && (
              <span className="italic font-serif">{visibleBrand}</span>
            )}
            {visibleAfter}
            <span className="ml-1 inline-block h-[0.92em] w-[3px] translate-y-[0.12em] bg-secondary animate-type-caret" />
          </span>
        </h1>

        {/* Subtitle / Description */}
        <p className="text-base md:text-lg text-white/90 mb-stack-lg font-light leading-relaxed max-w-2xl mx-auto">
          Direktori digital kuliner dan oleh-oleh khas Kota Gorontalo — dibuat agar pendatang, wisatawan, dan perantau lebih mudah menemukan usaha lokal terpercaya, langsung dari pencarian Google.
        </p>

        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full mx-auto shadow-soft rounded-2xl bg-white p-2 flex items-center gap-2 border border-white/20"
        >
          <span
            className="material-symbols-outlined text-outline-variant text-on-surface-variant ml-3 mr-1 select-none"
            data-icon="search"
          >
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (onSearch) {
                onSearch(e.target.value);
              }
            }}
            placeholder="Cari Usaha..."
            className="w-full h-12 bg-transparent text-on-surface placeholder:text-gray-400 focus:outline-none text-base border-none ring-0 focus:ring-0"
          />
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all ml-1 shrink-0 cursor-pointer shadow-sm active:scale-95"
          >
            Cari
          </button>
        </form>
      </div>
    </section>
  );
}
