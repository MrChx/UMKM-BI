"use client";

import { useState } from "react";
import RegistrationModal from "./RegistrationModal";

export default function CtaSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="daftar" className="py-24 bg-surface">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="bg-surface-variant rounded-[2rem] p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 border border-outline-variant/30">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#00193c_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative z-10 md:max-w-lg text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-display text-primary mb-4 tracking-tight font-bold">
              Ingin Bisnis Anda Dikenal?
            </h2>
            <p className="text-base text-on-surface-variant font-light leading-relaxed">
              Bergabunglah dengan ribuan pelaku usaha lainnya di direktori terbesar Gorontalo. Tingkatkan visibilitas dan jangkau lebih banyak pelanggan potensial setiap hari.
            </p>
          </div>
          <div className="relative z-10 flex-shrink-0 w-full md:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto bg-primary text-white px-8 py-4 rounded-xl text-base font-medium hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
            >
              Daftarkan Bisnis Sekarang
              <span
                className="material-symbols-outlined group-hover:translate-x-1 transition-transform"
                data-icon="arrow_forward"
              >
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
