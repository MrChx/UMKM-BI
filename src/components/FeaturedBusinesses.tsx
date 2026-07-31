"use client";

import { Business } from "@/lib/types";
import Link from "next/link";
import { useState, useMemo, useCallback } from "react";

interface FeaturedBusinessesProps {
  businesses: Business[];
  title?: string;
  subtitle?: string;
  isFiltered?: boolean;
}

// Parse koordinat dari Google Maps URL (format: ?q=lat,lng)
function parseCoords(mapsUrl: string): { lat: number; lng: number } | null {
  if (!mapsUrl) return null;
  const match = mapsUrl.match(/[?&]q=([-\d.]+),([-\d.]+)/);
  if (match) {
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  }
  return null;
}

// Haversine formula untuk jarak dalam km
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

type SortMode = "latest" | "nearest";

export default function FeaturedBusinesses({
  businesses,
  title,
  subtitle,
  isFiltered = false,
}: FeaturedBusinessesProps) {
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleWhatsApp = (e: React.MouseEvent, wa: string, name: string) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `Halo, saya menemukan ${name} melalui website Isi Torang Gorontalo.`
    );
    window.open(`https://wa.me/${wa}?text=${text}`, "_blank");
  };

  const handleOpenMaps = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, "_blank");
  };

  const handleGetNearestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Browser tidak mendukung geolokasi.");
      return;
    }
    setGettingLocation(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSortMode("nearest");
        setGettingLocation(false);
      },
      () => {
        setLocationError("Izin lokasi ditolak atau tidak tersedia.");
        setGettingLocation(false);
      }
    );
  }, []);

  const handleLatestMode = () => {
    setSortMode("latest");
    setLocationError(null);
  };

  // Hitung daftar yang ditampilkan: filter atau 12 terbaru/terdekat
  const displayedBusinesses = useMemo(() => {
    if (isFiltered) return businesses;

    if (sortMode === "nearest" && userLocation) {
      return [...businesses]
        .map((b) => {
          const coords = parseCoords(b.mapsUrl);
          const dist = coords
            ? haversine(userLocation.lat, userLocation.lng, coords.lat, coords.lng)
            : Infinity;
          return { ...b, _dist: dist };
        })
        .sort((a, b) => a._dist - b._dist)
        .slice(0, 12);
    }

    // Default: 12 terbaru (sudah diurutkan dari API berdasarkan created_at DESC)
    return businesses.slice(0, 12);
  }, [businesses, isFiltered, sortMode, userLocation]);

  const sectionTitle =
    title ?? (isFiltered ? "Hasil Pencarian Direktori" : "Daftar UMKM");
  const sectionSubtitle =
    subtitle ??
    (isFiltered
      ? `Menampilkan ${businesses.length} usaha sesuai filter.`
      : sortMode === "nearest" && userLocation
        ? "Menampilkan 12 UMKM terdekat dari lokasi Anda."
        : "12 UMKM terbaru yang cocok untuk anda");

  return (
    <section className="py-20 bg-surface-container">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-stack-xl">
          <div>
            <h2 className="text-2xl md:text-3xl font-display text-primary mb-2 tracking-tight font-bold">
              {sectionTitle}
            </h2>
            <p className="text-base text-on-surface-variant font-light">{sectionSubtitle}</p>
            {locationError && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                {locationError}
              </p>
            )}
          </div>

          {/* Controls: Mode Switch + Nearest Button */}
          {!isFiltered && (
            <div className="flex items-center gap-2 shrink-0">
              {/* Toggle Terbaru */}
              <button
                onClick={handleLatestMode}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${sortMode === "latest"
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-variant"
                  }`}
              >
                <span className="material-symbols-outlined text-base">schedule</span>
                Terbaru
              </button>

              {/* Toggle Terdekat */}
              <button
                onClick={sortMode === "nearest" && userLocation ? undefined : handleGetNearestLocation}
                disabled={gettingLocation}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${sortMode === "nearest" && userLocation
                  ? "bg-secondary text-white border-secondary shadow-sm"
                  : "bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-variant"
                  }`}
              >
                <span
                  className={`material-symbols-outlined text-base ${gettingLocation ? "animate-pulse" : ""
                    }`}
                >
                  {gettingLocation ? "my_location" : "near_me"}
                </span>
                {gettingLocation
                  ? "Mengambil Lokasi..."
                  : sortMode === "nearest" && userLocation
                    ? "Terdekat ✓"
                    : "Ambil Lokasi"}
              </button>

              <a
                className="hidden md:flex items-center text-sm font-medium text-primary hover:text-secondary transition-colors gap-1 group ml-2"
                href="#semua-bisnis"
              >
                Lihat Semua{" "}
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </a>
            </div>
          )}
        </div>

        {/* Grid */}
        {displayedBusinesses.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-2xl border border-outline-variant">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
              search_off
            </span>
            <p className="text-lg font-medium text-primary">Tidak ada usaha ditemukan</p>
            <p className="text-sm text-on-surface-variant">
              Coba kata kunci lain atau pilih kategori lain.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedBusinesses.map((item) => {
              const dist = (item as Business & { _dist?: number })._dist;
              return (
                <Link
                  key={item.id}
                  href={`/umkm/${item.id}`}
                  className="bg-surface rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group flex flex-col h-full border border-outline-variant/50 hover:-translate-y-1 block cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden bg-surface-variant">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      alt={item.name}
                      src={item.imageUrl}
                    />
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 bg-primary/90 text-white px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-sm shadow-sm">
                      {item.category}
                    </div>
                    {/* Distance Badge when nearest mode */}
                    {sortMode === "nearest" && dist !== undefined && dist !== Infinity && (
                      <div className="absolute bottom-3 left-3 bg-secondary/90 text-white px-2 py-0.5 rounded-md text-[10px] font-semibold backdrop-blur-sm flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-xs">near_me</span>
                        {dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-base font-display text-primary mb-1.5 line-clamp-1 tracking-tight font-bold group-hover:text-secondary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-light line-clamp-2 mb-5 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-auto flex gap-2">
                      <button
                        onClick={(e) => handleWhatsApp(e, item.whatsapp, item.name)}
                        className="flex-1 bg-primary text-white rounded-xl py-2.5 flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors text-xs font-semibold cursor-pointer shadow-sm active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        WhatsApp
                      </button>
                      <button
                        onClick={(e) => handleOpenMaps(e, item.mapsUrl)}
                        className="w-10 h-10 border border-outline-variant text-primary rounded-xl flex items-center justify-center hover:bg-surface-variant transition-colors cursor-pointer shrink-0 active:scale-95"
                        title="Buka Maps"
                      >
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
