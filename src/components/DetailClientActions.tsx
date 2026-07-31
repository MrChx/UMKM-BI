"use client";

import { useState } from "react";

interface DetailClientActionsProps {
  name: string;
  whatsapp: string;
  mapsUrl: string;
}

export default function DetailClientActions({
  name,
  whatsapp,
  mapsUrl,
}: DetailClientActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo, saya tertarik dengan ${name} setelah melihat di website Isi Torang Gorontalo.`
    );
    window.open(`https://wa.me/${whatsapp}?text=${text}`, "_blank");
  };

  const handleMaps = () => {
    window.open(mapsUrl, "_blank");
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <button
        onClick={handleWhatsApp}
        className="w-full bg-primary text-white py-3.5 px-4 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
      >
        <span className="material-symbols-outlined text-xl">chat</span>
        Chat WhatsApp Usaha
      </button>

      <button
        onClick={handleMaps}
        className="w-full border border-primary text-primary hover:bg-primary/5 py-3.5 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
      >
        <span className="material-symbols-outlined text-xl">location_on</span>
        Buka di Google Maps
      </button>

      <button
        onClick={handleShare}
        className="w-full border border-outline-variant text-on-surface-variant hover:bg-surface-variant py-3 px-4 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span className="material-symbols-outlined text-lg">
          {copied ? "check" : "share"}
        </span>
        {copied ? "Link Tersalin ke Clipboard!" : "Bagikan Info Usaha Ini"}
      </button>
    </div>
  );
}
