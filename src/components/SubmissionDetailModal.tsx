import React from "react";
import { PendingSubmission } from "@/context/UmkmContext";

interface SubmissionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: PendingSubmission | null;
}

export default function SubmissionDetailModal({ isOpen, onClose, submission }: SubmissionDetailModalProps) {
  if (!isOpen || !submission) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold uppercase">Menunggu Verifikasi</span>;
      case "approved":
        return <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-bold uppercase">Sudah Dipublikasi</span>;
      case "rejected":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold uppercase">Ditolak</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-slide-up relative border border-outline-variant">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-variant/50 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">analytics</span>
              Data Pengajuan: {submission.businessName}
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 font-mono">
              ID: {submission.id} | Diajukan: {new Date(submission.submittedAt).toLocaleString('id-ID')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface hover:bg-outline-variant flex items-center justify-center transition-colors cursor-pointer text-primary border border-outline-variant shadow-sm"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content (Table-like Grid) */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-surface space-y-8">
          
          {/* Section 1: Informasi Usaha */}
          <div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 pb-2 border-b border-outline-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-base">storefront</span>
              Informasi Usaha
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col border border-outline-variant rounded-lg p-3 bg-surface-variant/20">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Nama Usaha</span>
                <span className="text-sm font-medium text-primary">{submission.businessName}</span>
              </div>
              <div className="flex flex-col border border-outline-variant rounded-lg p-3 bg-surface-variant/20">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Kategori</span>
                <span className="text-sm font-medium text-primary">{submission.category}</span>
              </div>
              <div className="flex flex-col border border-outline-variant rounded-lg p-3 bg-surface-variant/20">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Status Pengajuan</span>
                <div>{getStatusBadge(submission.status)}</div>
              </div>
              <div className="flex flex-col border border-outline-variant rounded-lg p-3 bg-surface-variant/20">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Deskripsi</span>
                <span className="text-xs text-on-surface-variant leading-relaxed line-clamp-3" title={submission.description}>
                  {submission.description}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Lokasi & Kontak */}
          <div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 pb-2 border-b border-outline-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-base">contacts</span>
              Lokasi & Kontak
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col border border-outline-variant rounded-lg p-3 bg-surface-variant/20">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Nomor WhatsApp</span>
                <span className="text-sm font-medium text-primary font-mono">{submission.whatsapp}</span>
              </div>
              <div className="flex flex-col border border-outline-variant rounded-lg p-3 bg-surface-variant/20">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Jam Operasional</span>
                <span className="text-sm font-medium text-primary">{submission.openingHours}</span>
              </div>
              <div className="flex flex-col border border-outline-variant rounded-lg p-3 bg-surface-variant/20 md:col-span-2">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Alamat Lengkap</span>
                <span className="text-sm font-medium text-primary">{submission.address}</span>
              </div>
              <div className="flex flex-col border border-outline-variant rounded-lg p-3 bg-surface-variant/20 md:col-span-2">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Link Google Maps (Geotagging)</span>
                <a href={submission.geotagging} target="_blank" rel="noreferrer" className="text-xs text-secondary hover:underline break-all">
                  {submission.geotagging}
                </a>
              </div>
            </div>
          </div>

          {/* Section 3: Fasilitas & Layanan */}
          <div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 pb-2 border-b border-outline-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-base">list_alt</span>
              Fasilitas & Layanan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col border border-outline-variant rounded-lg p-3 bg-surface-variant/20">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-2">Metode Pembayaran</span>
                <div className="flex flex-wrap gap-1.5">
                  {submission.paymentMethods.length > 0 ? (
                    submission.paymentMethods.map((pm, i) => (
                      <span key={i} className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-semibold border border-primary/20">
                        {pm}
                      </span>
                    ))
                  ) : <span className="text-xs italic text-gray-400">-</span>}
                </div>
              </div>
              <div className="flex flex-col border border-outline-variant rounded-lg p-3 bg-surface-variant/20">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-2">Layanan Delivery</span>
                <div className="flex flex-wrap gap-1.5">
                  {submission.deliveryServices.length > 0 ? (
                    submission.deliveryServices.map((ds, i) => (
                      <span key={i} className="text-[10px] bg-secondary/10 text-secondary px-2 py-1 rounded font-semibold border border-secondary/20">
                        {ds}
                      </span>
                    ))
                  ) : <span className="text-xs italic text-gray-400">-</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Sosial Media */}
          <div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 pb-2 border-b border-outline-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-base">share</span>
              Sosial Media
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col border border-outline-variant rounded-lg p-3 bg-surface-variant/20">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Instagram</span>
                <span className="text-sm font-medium text-primary">{submission.instagram || "-"}</span>
              </div>
              <div className="flex flex-col border border-outline-variant rounded-lg p-3 bg-surface-variant/20">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">TikTok</span>
                <span className="text-sm font-medium text-primary">{submission.tiktok || "-"}</span>
              </div>
              <div className="flex flex-col border border-outline-variant rounded-lg p-3 bg-surface-variant/20">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Facebook</span>
                <span className="text-sm font-medium text-primary">{submission.facebook || "-"}</span>
              </div>
            </div>
          </div>

          {/* Section 5: Lampiran Media (Visual) */}
          <div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 pb-2 border-b border-outline-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-base">photo_library</span>
              Lampiran Media
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Foto Utama */}
              <div className="flex flex-col border border-outline-variant rounded-lg p-3 bg-surface-variant/20">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-2">Foto Profil Utama</span>
                <div className="w-full h-40 rounded-lg overflow-hidden border border-outline-variant bg-surface">
                  <img src={submission.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
                <a href={submission.thumbnailUrl} target="_blank" rel="noreferrer" className="text-[10px] text-secondary mt-2 hover:underline text-center">
                  Buka Gambar Penuh ↗
                </a>
              </div>

              {/* Foto Menu */}
              <div className="flex flex-col border border-outline-variant rounded-lg p-3 bg-surface-variant/20">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-2">Foto Menu / Fasilitas LENGKAP</span>
                {submission.menuImageUrl ? (
                  <>
                    <div className="w-full h-40 rounded-lg overflow-hidden border border-outline-variant bg-surface">
                      <img src={submission.menuImageUrl} alt="Menu" className="w-full h-full object-cover" />
                    </div>
                    <a href={submission.menuImageUrl} target="_blank" rel="noreferrer" className="text-[10px] text-secondary mt-2 hover:underline text-center">
                      Buka Gambar Penuh ↗
                    </a>
                  </>
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-surface border border-outline-variant rounded-lg">
                    <span className="text-xs text-on-surface-variant italic">Tidak dilampirkan</span>
                  </div>
                )}
              </div>

              {/* Galeri */}
              <div className="flex flex-col border border-outline-variant rounded-lg p-3 bg-surface-variant/20 md:col-span-2">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-2">Galeri Tambahan</span>
                {submission.galleryUrls.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {submission.galleryUrls.map((url, idx) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-outline-variant bg-surface">
                          <img src={url} alt={`Gallery ${idx+1}`} className="w-full h-full object-cover" />
                        </div>
                        <a href={url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold rounded-lg backdrop-blur-[1px]">
                          Buka ↗
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-on-surface-variant italic">Tidak ada galeri tambahan</span>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
