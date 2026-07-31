"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryFilter from "@/components/CategoryFilter";
import FeaturedBusinesses from "@/components/FeaturedBusinesses";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import { useUmkm } from "@/context/UmkmContext";

export default function Home() {
  const { businesses } = useUmkm();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((item) => {

      if (activeCategory) {
        const catLower = activeCategory.toLowerCase();
        const itemCatLower = item.category.toLowerCase();
        if (catLower !== itemCatLower && !itemCatLower.includes(catLower)) {
          return false;
        }
      }

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        if (!matchName && !matchCategory && !matchDesc) {
          return false;
        }
      }
      return true;
    });
  }, [businesses, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background antialiased font-sans">
      <Navbar />
      <main className="flex-grow">
        <Hero onSearch={(query) => setSearchQuery(query)} />
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={(catId) => setActiveCategory(catId)}
        />
        <div id="semua-bisnis">
          <FeaturedBusinesses
            businesses={filteredBusinesses}
            isFiltered={!!(activeCategory || searchQuery)}
            title={
              activeCategory || searchQuery
                ? "Hasil Pencarian Direktori"
                : undefined
            }
            subtitle={
              activeCategory || searchQuery
                ? `Menampilkan ${filteredBusinesses.length} usaha sesuai filter.`
                : undefined
            }
          />
        </div>
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
