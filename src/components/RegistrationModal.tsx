"use client";

import { useState } from "react";
import { CATEGORIES } from "@/data/mockData";
import { useUmkm } from "@/context/UmkmContext";
import { uploadImageToSupabase } from "@/lib/supabase";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({
  isOpen,
  onClose,
}: RegistrationModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    category: "kuliner",
    description: "",
    address: "",
    geotagging: "",
    whatsapp: "",
    openingHours: "",
    paymentMethods: ["Cash", "Transfer Bank", "QRIS"],
    deliveryServices: ["Maxim", "Grab", "Gojek", "ShopeeFood"],
    instagram: "",
    tiktok: "",
    facebook: "",
  });

  const [menuItems, setMenuItems] = useState<string[]>([""]);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  
  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [menuPreview, setMenuPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addSubmission } = useUmkm();

  if (!isOpen) return null;

  const handleAddMenuItem = () => {
    setMenuItems([...menuItems, ""]);
  };

  const handleMenuItemChange = (index: number, value: string) => {
    const updated = [...menuItems];
    updated[index] = value;
    setMenuItems(updated);
  };

  const handleRemoveMenuItem = (index: number) => {
    if (menuItems.length === 1) return;
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setGalleryFiles((prev) => [...prev, ...newFiles]);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryFiles(galleryFiles.filter((_, i) => i !== index));
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
  };

  // Handle Menu Photo Upload
  const handleMenuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMenuFile(file);
      const previewUrl = URL.createObjectURL(file);
      setMenuPreview(previewUrl);
    }
  };

  const handleRemoveMenuImage = () => {
    setMenuFile(null);
    setMenuPreview(null);
  };

  const handleTogglePayment = (method: string) => {
    if (formData.paymentMethods.includes(method)) {
      setFormData({
        ...formData,
        paymentMethods: formData.paymentMethods.filter((p) => p !== method),
      });
    } else {
      setFormData({
        ...formData,
        paymentMethods: [...formData.paymentMethods, method],
      });
    }
  };

  const handleToggleDelivery = (service: string) => {
    if (formData.deliveryServices.includes(service)) {
      setFormData({
        ...formData,
        deliveryServices: formData.deliveryServices.filter((s) => s !== service),
      });
    } else {
      setFormData({
        ...formData,
        deliveryServices: [...formData.deliveryServices, service],
      });
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
          setFormData((prev) => ({
            ...prev,
            geotagging: mapsUrl,
          }));
          setGettingLocation(false);
        },
        (error) => {
          console.error(error);
          alert("Gagal mendapatkan lokasi otomatis. Anda dapat memasukkan link Google Maps secara manual.");
          setGettingLocation(false);
        }
      );
    } else {
      alert("Browser Anda tidak mendukung Geolocation.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalThumbnailUrl = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80";
      if (thumbnailFile) {
        finalThumbnailUrl = await uploadImageToSupabase(thumbnailFile);
      }

      let finalGalleryUrls: string[] = [];
      if (galleryFiles.length > 0) {
        finalGalleryUrls = await Promise.all(
          galleryFiles.map((file) => uploadImageToSupabase(file))
        );
      }

      let finalMenuImageUrl = undefined;
      if (menuFile) {
        finalMenuImageUrl = await uploadImageToSupabase(menuFile);
      }

      await addSubmission({
        businessName: formData.businessName,
        category: formData.category,
        description: formData.description,
        address: formData.address,
        geotagging: formData.geotagging,
        whatsapp: formData.whatsapp,
        openingHours: formData.openingHours,
        paymentMethods: formData.paymentMethods,
        deliveryServices: formData.deliveryServices,
        instagram: formData.instagram,
        tiktok: formData.tiktok,
        facebook: formData.facebook,
        thumbnailUrl: finalThumbnailUrl,
        galleryUrls: finalGalleryUrls,
        menuImageUrl: finalMenuImageUrl,
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengirim pengajuan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-soft border border-outline-variant relative max-h-[90vh] overflow-y-auto font-sans">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-xl hover:bg-surface-variant cursor-pointer z-10"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {submitted ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-primary mb-2">
              Pendaftaran Usaha Berhasil Dikirim!
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-md mx-auto">
              Terima kasih telah mendaftarkan usaha Anda. Tim Isi Torang Gorontalo akan memverifikasi data dan menghubungi Anda via WhatsApp.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6 pb-4 border-b border-outline-variant">
              <h3 className="text-2xl font-display font-extrabold text-primary mb-1">
                Formulir Pendaftaran UMKM / Usaha
              </h3>
              <p className="text-xs text-on-surface-variant font-light">
                Lengkapi rincian usaha Anda agar calon pelanggan dapat menemukan tempat, menu, dan kontak Anda dengan mudah.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SECTION 1: INFORMASI UTAMA */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-lg">store</span>
                  Informasi Utama Usaha
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">
                      Nama Usaha / UMKM *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">
                      Kategori Usaha *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Deskripsi Usaha *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                  />
                </div>
              </div>

              {/* SECTION 2: LOKASI & GEOTAGGING */}
              <div className="space-y-4 pt-4 border-t border-outline-variant">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-lg">location_on</span>
                  Lokasi & Geotagging
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Alamat *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jl. Nani Wartabone No. 45, Kota Gorontalo"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Geotagging Tempat / Link Google Maps
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.geotagging}
                      onChange={(e) => setFormData({ ...formData, geotagging: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleGetCurrentLocation}
                      disabled={gettingLocation}
                      className="px-3.5 py-2.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">my_location</span>
                      {gettingLocation ? "Mengambil..." : "Deteksi GPS"}
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 3: KONTAK & OPERASIONAL */}
              <div className="space-y-4 pt-4 border-t border-outline-variant">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-lg">call</span>
                  Kontak & Jam Operasional
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">
                      Jam Operasional *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Setiap Hari (08.00 - 22.00 WITA)"
                      value={formData.openingHours}
                      onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: MENU & FASILITAS (DYNAMIC FIELDS) */}
              <div className="space-y-4 pt-4 border-t border-outline-variant">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-lg">inventory_2</span>
                    Menu & Fasilitas yang Dijual / Sewakan
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddMenuItem}
                    className="text-xs text-primary font-bold hover:text-secondary flex items-center gap-1 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/20 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Tambah Kolom
                  </button>
                </div>

                <div className="space-y-2.5">
                  {menuItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder={`Contoh: Nasi Goreng Sagela / Wifi (${idx + 1})`}
                        value={item}
                        onChange={(e) => handleMenuItemChange(idx, e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                      />
                      {menuItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMenuItem(idx)}
                          className="w-9 h-9 text-red-500 hover:bg-red-50 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Upload Foto Menu Tambahan */}
                <div className="mt-4 border-t border-dashed border-outline-variant pt-4">
                  <label className="block text-[11px] font-semibold text-primary mb-1">
                    Atau Unggah Foto Menu / Fasilitas Lengkap (Opsional)
                  </label>
                  {!menuPreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-outline-variant rounded-xl cursor-pointer bg-surface hover:bg-surface-variant transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <span className="material-symbols-outlined text-secondary mb-1">add_photo_alternate</span>
                        <p className="text-xs text-on-surface-variant text-center px-4">
                          <span className="font-semibold text-primary">Pilih foto menu</span> atau seret kesini
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleMenuChange}
                      />
                    </label>
                  ) : (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden group border border-outline-variant bg-surface">
                      <img
                        src={menuPreview}
                        alt="Menu Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveMenuImage}
                        className="absolute top-1 right-1 bg-red-600/90 text-white p-1 rounded-md shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 5: METODE PEMBAYARAN & LAYANAN (CEKLIS) */}
              <div className="space-y-4 pt-4 border-t border-outline-variant">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ceklis Pembayaran */}
                  <div>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-base">payments</span>
                      Metode Pembayaran
                    </h4>
                    <div className="space-y-2">
                      {["Cash", "Transfer Bank", "QRIS"].map((pm) => (
                        <label
                          key={pm}
                          className="flex items-center gap-2.5 text-xs text-primary font-medium cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={formData.paymentMethods.includes(pm)}
                            onChange={() => handleTogglePayment(pm)}
                            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                          />
                          {pm}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Ceklis Layanan Delivery */}
                  <div>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-base">moped</span>
                      Layanan Delivery / Transportasi
                    </h4>
                    <div className="space-y-2">
                      {["Maxim", "Grab", "Gojek", "ShopeeFood"].map((ds) => (
                        <label
                          key={ds}
                          className="flex items-center gap-2.5 text-xs text-primary font-medium cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={formData.deliveryServices.includes(ds)}
                            onChange={() => handleToggleDelivery(ds)}
                            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                          />
                          {ds}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: MEDIA SOSIAL */}
              <div className="space-y-4 pt-4 border-t border-outline-variant">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-lg">share</span>
                  Akun Media Sosial
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-primary mb-1">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-primary mb-1">
                      TikTok
                    </label>
                    <input
                      type="text"
                      value={formData.tiktok}
                      onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-primary mb-1">
                      Facebook
                    </label>
                    <input
                      type="text"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 7: UPLOAD FOTO DARI GALERI HP / KOMPUTER */}
              <div className="space-y-4 pt-4 border-t border-outline-variant">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-lg">add_a_photo</span>
                  Upload Foto Usaha dari Galeri
                </h4>

                {/* 1. Upload Thumbnail Foto Sampul */}
                <div className="bg-surface-variant/40 p-4 rounded-2xl border border-outline-variant/60">
                  <label className="block text-xs font-bold text-primary mb-2">
                    Foto Sampul
                  </label>

                  {thumbnailPreview ? (
                    <div className="relative w-full h-44 rounded-xl overflow-hidden group border border-outline-variant">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveThumbnail}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                        title="Hapus Foto"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-outline-variant rounded-xl cursor-pointer hover:bg-surface-variant/70 transition-colors p-4 text-center">
                      <span className="material-symbols-outlined text-3xl text-primary mb-1">
                        photo_library
                      </span>
                      <span className="text-xs font-semibold text-primary">
                        Klik untuk Pilih Foto Sampul dari Galeri
                      </span>
                      <span className="text-[11px] text-on-surface-variant font-light mt-0.5">
                        PNG, JPG, WEBP (Maksimal 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* 2. Upload Galeri Foto Suasana Dalam */}
                <div className="bg-surface-variant/40 p-4 rounded-2xl border border-outline-variant/60">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-primary">
                      Foto Suasana Tempat
                    </label>
                    <label className="text-xs text-primary font-bold hover:text-secondary flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                      + Pilih Foto dari Galeri
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {galleryPreviews.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {galleryPreviews.map((preview, idx) => (
                        <div
                          key={idx}
                          className="relative h-28 rounded-xl overflow-hidden group border border-outline-variant bg-surface"
                        >
                          <img
                            src={preview}
                            alt={`Gallery photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute top-1 right-1 bg-red-600/90 text-white p-1 rounded-md shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-on-surface-variant font-light italic mt-2">
                      Belum ada foto suasana yang dipilih dari galeri.
                    </p>
                  )}
                </div>
              </div>

              {/* SUBMIT BUTTONS */}
              <div className="pt-6 border-t border-outline-variant flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-semibold text-on-surface-variant hover:bg-surface-variant transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base">
                    {isSubmitting ? "progress_activity" : "send"}
                  </span>
                  {isSubmitting ? "Mengupload..." : "Kirim Pendaftaran Usaha"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
