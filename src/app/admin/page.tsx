"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUmkm, PendingSubmission } from "@/context/UmkmContext";
import { CATEGORIES } from "@/data/mockData";
import { uploadImageToSupabase } from "@/lib/supabase";
import SubmissionDetailModal from "@/components/SubmissionDetailModal";
import toast from "react-hot-toast";
import { Business } from "@/lib/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    businesses,
    submissions,
    loadingBusinesses,
    loadingSubmissions,
    selectedSubmissionForImport,
    setSelectedSubmissionForImport,
    updateSubmissionStatus,
    deleteSubmission,
    addBusiness,
    updateBusiness,
    deleteBusiness,
  } = useUmkm();

  const [activeTab, setActiveTab] = useState<"overview" | "submissions" | "input_form" | "active_list">("overview");
  const [editingBusinessId, setEditingBusinessId] = useState<string | null>(null);

  const [adminFormData, setAdminFormData] = useState({
    businessName: "",
    category: "Kuliner",
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

  const [gettingLocation, setGettingLocation] = useState(false);
  const [menuItems, setMenuItems] = useState<string[]>([""]);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [selectedSubmissionForDetail, setSelectedSubmissionForDetail] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [menuFile, setMenuFile] = useState<File | null>(null);
  const [menuPreview, setMenuPreview] = useState<string | null>(null);

  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Search States
  const [searchSubmissions, setSearchSubmissions] = useState("");
  const [searchBusinesses, setSearchBusinesses] = useState("");

  const filteredSubmissions = submissions.filter(s => 
    s.businessName.toLowerCase().includes(searchSubmissions.toLowerCase()) || 
    s.category.toLowerCase().includes(searchSubmissions.toLowerCase())
  );

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchBusinesses.toLowerCase()) || 
    b.category.toLowerCase().includes(searchBusinesses.toLowerCase())
  );

  useEffect(() => {
    if (selectedSubmissionForImport) {
      const sub = selectedSubmissionForImport;
      setAdminFormData({
        businessName: sub.businessName,
        category: sub.category,
        description: sub.description,
        address: sub.address,
        geotagging: sub.geotagging || "https://maps.google.com",
        whatsapp: sub.whatsapp,
        openingHours: sub.openingHours,
        paymentMethods: sub.paymentMethods.length > 0 ? sub.paymentMethods : ["Cash", "QRIS"],
        deliveryServices: sub.deliveryServices.length > 0 ? sub.deliveryServices : ["Maxim", "Grab"],
        instagram: sub.instagram || "",
        tiktok: sub.tiktok || "",
        facebook: sub.facebook || "",
      });

      setThumbnailPreview(sub.thumbnailUrl || null);
      setGalleryPreviews(sub.galleryUrls || []);
      setMenuPreview(sub.menuImageUrl || null);
      setMenuItems(["Nasi Goreng Sagela / Menu Unggulan", "Layanan Tempat / WiFi"]);

      setActiveTab("input_form");
    }
  }, [selectedSubmissionForImport]);

  const handleImportSubmission = (sub: PendingSubmission) => {
    setSelectedSubmissionForImport(sub);
    setEditingBusinessId(null);
  };

  const handleEditBusiness = (biz: Business) => {
    setEditingBusinessId(biz.id);
    setSelectedSubmissionForImport(null);
    setAdminFormData({
      businessName: biz.name,
      category: biz.category,
      description: biz.fullDescription || biz.description,
      address: biz.address || "",
      geotagging: biz.mapsUrl,
      whatsapp: biz.whatsapp,
      openingHours: biz.openingHours || "",
      paymentMethods: biz.paymentMethods || [],
      deliveryServices: biz.deliveryServices || [],
      instagram: biz.socialMedia?.instagram || "",
      tiktok: biz.socialMedia?.tiktok || "",
      facebook: biz.socialMedia?.facebook || "",
    });

    setThumbnailPreview(biz.imageUrl || null);
    setGalleryPreviews(biz.galleryImages || []);
    setMenuPreview(biz.menuImageUrl || null);
    setMenuItems(biz.highlights && biz.highlights.length > 0 ? biz.highlights : [""]);

    setActiveTab("input_form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenDetail = (sub: PendingSubmission) => {
    setSelectedSubmissionForDetail(sub);
    setIsDetailModalOpen(true);
  };

  const handleDeleteSubmission = async (id: string) => {
    if (confirm("Yakin ingin menghapus pengajuan ini?")) {
      try {
        await deleteSubmission(id);
        toast.success("Pengajuan berhasil dihapus");
      } catch (err) {
        toast.error("Gagal menghapus pengajuan");
      }
    }
  };

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
    if (adminFormData.paymentMethods.includes(method)) {
      setAdminFormData({
        ...adminFormData,
        paymentMethods: adminFormData.paymentMethods.filter((p) => p !== method),
      });
    } else {
      setAdminFormData({
        ...adminFormData,
        paymentMethods: [...adminFormData.paymentMethods, method],
      });
    }
  };

  const handleToggleDelivery = (service: string) => {
    if (adminFormData.deliveryServices.includes(service)) {
      setAdminFormData({
        ...adminFormData,
        deliveryServices: adminFormData.deliveryServices.filter((s) => s !== service),
      });
    } else {
      setAdminFormData({
        ...adminFormData,
        deliveryServices: [...adminFormData.deliveryServices, service],
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
          setAdminFormData((prev) => ({
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

  const handlePublishBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);

    try {
      let finalThumbnailUrl = thumbnailPreview || "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80";
      if (thumbnailFile) {
        finalThumbnailUrl = await uploadImageToSupabase(thumbnailFile);
      }

      let finalGalleryUrls = galleryPreviews.filter((g) => g.trim() !== "");
      if (galleryFiles.length > 0) {
        const uploadedGallery = await Promise.all(
          galleryFiles.map((file) => uploadImageToSupabase(file))
        );
        const existingNonBlob = galleryPreviews.filter(p => !p.startsWith("blob:"));
        finalGalleryUrls = [...existingNonBlob, ...uploadedGallery];
      }

      let finalMenuImageUrl = menuPreview && !menuPreview.startsWith("blob:") ? menuPreview : undefined;
      if (menuFile) {
        finalMenuImageUrl = await uploadImageToSupabase(menuFile);
      }

      const finalBiz = {
        name: adminFormData.businessName,
        category: adminFormData.category,
        description: adminFormData.description,
        fullDescription: adminFormData.description,
        imageUrl: finalThumbnailUrl,
        galleryImages: finalGalleryUrls,
        whatsapp: adminFormData.whatsapp,
        mapsUrl: adminFormData.geotagging || "https://maps.google.com",
        address: adminFormData.address,
        openingHours: adminFormData.openingHours,
        highlights: menuItems.filter((item) => item.trim() !== ""),
        paymentMethods: adminFormData.paymentMethods,
        deliveryServices: adminFormData.deliveryServices,
        socialMedia: {
          instagram: adminFormData.instagram,
          tiktok: adminFormData.tiktok,
          facebook: adminFormData.facebook,
        },
        menuImageUrl: finalMenuImageUrl,
        featured: true,
      };

      if (editingBusinessId) {
        await updateBusiness({ id: editingBusinessId, ...finalBiz } as Business);
        toast.success("UMKM berhasil diperbarui!");
      } else {
        await addBusiness(finalBiz);
        if (selectedSubmissionForImport) {
          await updateSubmissionStatus(selectedSubmissionForImport.id, "approved");
          setSelectedSubmissionForImport(null);
        }
        toast.success("UMKM baru berhasil dipublikasikan!");
      }

      setPublishedSuccess(true);
      setTimeout(() => {
        setPublishedSuccess(false);
        setEditingBusinessId(null);
        setAdminFormData({
          businessName: "",
          category: "Kuliner",
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
        setMenuItems([""]);
        setThumbnailPreview(null);
        setThumbnailFile(null);
        setGalleryPreviews([]);
        setGalleryFiles([]);
        setMenuPreview(null);
        setMenuFile(null);
        setActiveTab("active_list");
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mempublikasikan usaha. Periksa koneksi.");
    } finally {
      setIsPublishing(false);
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pendingSubmissionsCount = submissions.filter((s) => s.status === "pending").length;

  const handleTabClick = (tab: "overview" | "submissions" | "input_form" | "active_list") => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Failed to logout", e);
    }
    sessionStorage.removeItem("admin_authenticated");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-surface-container flex flex-col md:flex-row antialiased font-sans text-on-background">
      {/* MOBILE TOP HEADER BAR */}
      <header className="md:hidden bg-surface border-b border-outline-variant px-4 py-3 sticky top-0 z-30 flex justify-between items-center shadow-xs">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="Logo Thrive GenBI"
            className="w-11 h-11 object-contain"
          />
          <div>
            <h1 className="text-sm font-display font-extrabold text-primary leading-tight">
              Isi Torang Admin
            </h1>
          </div>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-primary p-2 rounded-xl hover:bg-surface-variant focus:outline-none cursor-pointer flex items-center gap-1 border border-outline-variant text-xs font-semibold"
        >
          <span className="material-symbols-outlined text-xl">
            {mobileMenuOpen ? "close" : "menu"}
          </span>
          <span>{mobileMenuOpen ? "Tutup" : "Menu"}</span>
        </button>
      </header>

      {/* SIDEBAR NAVIGATION (Desktop Permanent, Mobile Collapsible) */}
      <aside
        className={`${mobileMenuOpen ? "block" : "hidden md:flex"
          } w-full md:w-64 bg-surface border-r border-outline-variant shrink-0 flex-col justify-between p-4 md:p-6 sticky top-14 md:top-0 h-auto md:h-screen z-20 shadow-lg md:shadow-none`}
      >
        <div>
          {/* Logo Brand Admin (Desktop Only) */}
          <Link href="/" className="hidden md:flex items-center gap-3 mb-8 px-2 group">
            <img
              src="/logo.png"
              alt="Logo Thrive GenBI"
              className="w-12 h-12 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
            />
            <div>
              <h1 className="text-base font-display font-extrabold text-primary leading-tight">
                Isi Torang
              </h1>
              <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                Admin Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => handleTabClick("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "overview"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:bg-surface-variant hover:text-primary"
                }`}
            >
              <span className="material-symbols-outlined text-lg">dashboard</span>
              Dashboard Utama
            </button>

            <button
              onClick={() => handleTabClick("submissions")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "submissions"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:bg-surface-variant hover:text-primary"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">inbox</span>
                Pengajuan Masuk
              </div>
              {pendingSubmissionsCount > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {pendingSubmissionsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick("input_form")}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "input_form"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:bg-surface-variant hover:text-primary"
                }`}
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Form Penginputan
            </button>

            <button
              onClick={() => handleTabClick("active_list")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeTab === "active_list"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:bg-surface-variant hover:text-primary"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg">storefront</span>
                UMKM Aktif Tayang
              </div>
              <span className="bg-surface-variant text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-outline-variant">
                {businesses.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-outline-variant space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors border border-outline-variant"
          >
            <span className="material-symbols-outlined text-base">open_in_new</span>
            Lihat Website Utama
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors border border-red-200 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Keluar Admin
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto overflow-y-auto">
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-primary mb-1">
                Dashboard Ringkasan Admin
              </h2>
              <p className="text-xs text-on-surface-variant font-light">
                Kelola direktori UMKM, tinjau pengajuan bisnis publik, dan publikasikan usaha baru ke halaman utama.
              </p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-surface p-5 rounded-2xl border border-outline-variant/60 shadow-card flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">storefront</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">UMKM Aktif Tayang</p>
                  <h3 className="text-2xl font-bold text-primary">{businesses.length}</h3>
                </div>
              </div>

              <div className="bg-surface p-5 rounded-2xl border border-outline-variant/60 shadow-card flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">pending_actions</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">Pengajuan Pendaftaran</p>
                  <h3 className="text-2xl font-bold text-amber-600">{pendingSubmissionsCount}</h3>
                </div>
              </div>

              <div className="bg-surface p-5 rounded-2xl border border-outline-variant/60 shadow-card flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">category</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">Total Kategori</p>
                  <h3 className="text-2xl font-bold text-primary">{CATEGORIES.length}</h3>
                </div>
              </div>

              <div className="bg-surface p-5 rounded-2xl border border-outline-variant/60 shadow-card flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">group</span>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-medium">Pengunjung Bulan ini</p>
                  <h3 className="text-2xl font-bold text-emerald-600">1,480+</h3>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Submissions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Pending Submissions */}
              <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-outline-variant/60 shadow-card space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
                  <h3 className="text-base font-display font-bold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">inbox</span>
                    Pengajuan Pendaftaran Terbaru
                  </h3>
                  <button
                    onClick={() => setActiveTab("submissions")}
                    className="text-xs font-semibold text-primary hover:text-secondary transition-colors"
                  >
                    Lihat Semua ({submissions.length})
                  </button>
                </div>

                {submissions.length === 0 ? (
                  <p className="text-xs text-on-surface-variant italic py-4">Belum ada pengajuan pendaftaran baru.</p>
                ) : (
                  <div className="space-y-3">
                    {submissions.slice(0, 3).map((sub) => (
                      <div
                        key={sub.id}
                        className="p-4 rounded-xl bg-surface-variant/40 border border-outline-variant/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-primary">{sub.businessName}</h4>
                            <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                              {sub.category}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant font-light line-clamp-1 mt-0.5">
                            {sub.address} • WA: {sub.whatsapp}
                          </p>
                        </div>

                        <button
                          onClick={() => handleImportSubmission(sub)}
                          className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">download_for_offline</span>
                          Impor ke Form
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Admin Actions */}
              <div className="bg-surface p-6 rounded-2xl border border-outline-variant/60 shadow-card space-y-4">
                <h3 className="text-base font-display font-bold text-primary pb-3 border-b border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">bolt</span>
                  Aksi Cepat Admin
                </h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => {
                      setSelectedSubmissionForImport(null);
                      setEditingBusinessId(null);
                      setAdminFormData({
                        businessName: "",
                        category: "Kuliner",
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
                      setMenuItems([""]);
                      setThumbnailPreview(null);
                      setGalleryPreviews([]);
                      setActiveTab("input_form");
                    }}
                    className="w-full bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 p-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">add_box</span>
                    Tambah Usaha Manual Baru
                  </button>

                  <button
                    onClick={() => setActiveTab("submissions")}
                    className="w-full bg-amber-500/5 hover:bg-amber-500/10 text-amber-700 border border-amber-500/20 p-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">rule</span>
                    Verifikasi Pendaftaran ({pendingSubmissionsCount})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PENGAJUAN DAFTARKAN BISNIS (PENDING SUBMISSIONS & IMPORT) */}
        {activeTab === "submissions" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-outline-variant">
              <div>
                <h2 className="text-2xl font-display font-extrabold text-primary mb-1">
                  Hasil Penginputan "Daftarkan Bisnis"
                </h2>
                <p className="text-xs text-on-surface-variant font-light">
                  Daftar UMKM yang didaftarkan oleh pengunjung publik. Gunakan fitur **"Impor ke Form"** untuk meninjau dan mempublikasikannya ke halaman utama.
                </p>
              </div>
              <span className="bg-amber-500/10 text-amber-700 font-bold px-3 py-1.5 rounded-xl text-xs border border-amber-500/20 whitespace-nowrap">
                {pendingSubmissionsCount} Pengajuan Menunggu Verifikasi
              </span>
            </div>

            {/* Search Input for Submissions */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                type="text"
                placeholder="Cari nama usaha atau kategori pengajuan..."
                value={searchSubmissions}
                onChange={(e) => setSearchSubmissions(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {filteredSubmissions.length === 0 ? (
              <div className="text-center py-16 bg-surface rounded-2xl border border-outline-variant">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
                  inbox
                </span>
                <p className="text-base font-bold text-primary">Belum Ada Pengajuan Pendaftaran</p>
                <p className="text-xs text-on-surface-variant">
                  {searchSubmissions ? "Tidak ada hasil yang cocok dengan pencarian Anda." : "Pengajuan baru dari formulir 'Daftarkan Bisnis' di halaman beranda akan muncul di sini."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-surface rounded-2xl p-6 shadow-card border border-outline-variant/60 flex flex-col lg:flex-row gap-6 justify-between items-start"
                  >
                    {/* Thumbnail & Info (Clickable for Detail) */}
                    <div 
                      className="flex flex-col sm:flex-row gap-4 flex-1 cursor-pointer hover:bg-surface-variant/50 p-2 -m-2 rounded-xl transition-colors"
                      onClick={() => {
                        setSelectedSubmissionForDetail(sub);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      <img
                        src={sub.thumbnailUrl}
                        alt={sub.businessName}
                        className="w-full sm:w-36 h-28 object-cover rounded-xl bg-surface-variant border border-outline-variant shrink-0"
                      />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-lg font-display font-bold text-primary">
                            {sub.businessName}
                          </h3>
                          <span className="bg-secondary text-primary font-bold px-2.5 py-0.5 rounded-md text-[11px]">
                            {sub.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${sub.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : sub.status === "approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                              }`}
                          >
                            {sub.status === "pending"
                              ? "Menunggu Verifikasi"
                              : sub.status === "approved"
                                ? "Sudah Dipublikasi"
                                : "Ditolak"}
                          </span>
                        </div>

                        <p className="text-xs text-on-surface-variant font-light line-clamp-2 leading-relaxed">
                          {sub.description}
                        </p>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-primary font-medium">
                          <span>📍 {sub.address}</span>
                          <span>💬 WA: {sub.whatsapp}</span>
                          <span>⏰ {sub.openingHours}</span>
                        </div>

                        {/* Payment & Delivery Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {sub.paymentMethods.map((pm, i) => (
                            <span key={i} className="text-[10px] bg-surface-variant px-2 py-0.5 rounded text-primary font-medium">
                              💳 {pm}
                            </span>
                          ))}
                          {sub.deliveryServices.map((ds, i) => (
                            <span key={i} className="text-[10px] bg-surface-variant px-2 py-0.5 rounded text-primary font-medium">
                              🛵 {ds}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Import, Approval, Delete */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-48 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-outline-variant">
                      <button
                        onClick={() => handleImportSubmission(sub)}
                        className="w-full bg-primary text-white py-2.5 px-3 rounded-xl text-xs font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">download_for_offline</span>
                        Impor ke Form Admin
                      </button>

                      {sub.status === "pending" && (
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => updateSubmissionStatus(sub.id, "approved")}
                            className="flex-1 bg-emerald-600 text-white py-2 px-2 rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => updateSubmissionStatus(sub.id, "rejected")}
                            className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 py-2 px-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Tolak
                          </button>
                        </div>
                      )}
                      
                      {/* Delete History */}
                      <button
                        onClick={() => {
                          if (confirm("Yakin ingin menghapus riwayat pengajuan ini permanen?")) {
                            deleteSubmission(sub.id);
                          }
                        }}
                        className="w-full border border-red-200 text-red-500 hover:bg-red-50 py-2.5 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                      >
                        <span className="material-symbols-outlined text-sm">delete_forever</span>
                        Hapus Pengajuan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FORM PENGINPUTAN */}
        {activeTab === "input_form" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
              <div>
                <h2 className="text-2xl font-display font-extrabold text-primary mb-1">
                  {editingBusinessId ? "Edit UMKM (Admin)" : "Form Penginputan Publikasi UMKM (Admin)"}
                </h2>
                <p className="text-xs text-on-surface-variant font-light">
                  {editingBusinessId 
                    ? "Ubah data UMKM yang sudah dipublikasikan di bawah ini." 
                    : selectedSubmissionForImport
                    ? `⚠️ Data di bawah ini telah di-impor dari pengajuan: "${selectedSubmissionForImport.businessName}". Silakan periksa dan klik Publikasikan.`
                    : "Formulir ini memiliki struktur 100% persis seperti Formulir Pendaftaran Utama."}
                </p>
              </div>

              {selectedSubmissionForImport && (
                <button
                  onClick={() => setSelectedSubmissionForImport(null)}
                  className="bg-surface-variant text-primary text-xs font-semibold px-3 py-1.5 rounded-xl border border-outline-variant hover:bg-outline-variant/30"
                >
                  Reset Hasil Impor
                </button>
              )}
            </div>

            {publishedSuccess && (
              <div className="p-4 bg-emerald-500/10 text-emerald-800 rounded-xl border border-emerald-500/20 text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-emerald-600">check_circle</span>
                Usaha berhasil dipublikasikan dan langsung aktif tayang di Beranda Utama!
              </div>
            )}

            <form onSubmit={handlePublishBusiness} className="bg-surface p-6 md:p-8 rounded-3xl border border-outline-variant/60 shadow-soft space-y-6">
              {/* SECTION 1: INFORMASI UTAMA */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-lg">store</span>
                  1. Informasi Utama Usaha
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">
                      Nama Usaha / UMKM *
                    </label>
                    <input
                      type="text"
                      required
                      value={adminFormData.businessName}
                      onChange={(e) => setAdminFormData({ ...adminFormData, businessName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">
                      Kategori Usaha *
                    </label>
                    <select
                      value={adminFormData.category}
                      onChange={(e) => setAdminFormData({ ...adminFormData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>
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
                    value={adminFormData.description}
                    onChange={(e) => setAdminFormData({ ...adminFormData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                  />
                </div>
              </div>

              {/* SECTION 2: LOKASI & GEOTAGGING */}
              <div className="space-y-4 pt-4 border-t border-outline-variant">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-lg">location_on</span>
                  2. Lokasi & Geotagging
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Alamat Tempat *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jl. Nani Wartabone No. 45, Kota Gorontalo"
                    value={adminFormData.address}
                    onChange={(e) => setAdminFormData({ ...adminFormData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Geotagging Tempat
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={adminFormData.geotagging}
                      onChange={(e) => setAdminFormData({ ...adminFormData, geotagging: e.target.value })}
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
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-lg">call</span>
                  3. Kontak & Jam Operasional
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">
                      Nomor WhatsApp Usaha *
                    </label>
                    <input
                      type="tel"
                      required
                      value={adminFormData.whatsapp}
                      onChange={(e) => setAdminFormData({ ...adminFormData, whatsapp: e.target.value })}
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
                      value={adminFormData.openingHours}
                      onChange={(e) => setAdminFormData({ ...adminFormData, openingHours: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: MENU & FASILITAS (DYNAMIC FIELDS) */}
              <div className="space-y-4 pt-4 border-t border-outline-variant">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-lg">inventory_2</span>
                    4. Menu & Fasilitas yang Dijual / Sewakan
                  </h3>
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
                            checked={adminFormData.paymentMethods.includes(pm)}
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
                            checked={adminFormData.deliveryServices.includes(ds)}
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
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-lg">share</span>
                  6. Akun Media Sosial
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-primary mb-1">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={adminFormData.instagram}
                      onChange={(e) => setAdminFormData({ ...adminFormData, instagram: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-primary mb-1">
                      TikTok
                    </label>
                    <input
                      type="text"
                      value={adminFormData.tiktok}
                      onChange={(e) => setAdminFormData({ ...adminFormData, tiktok: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-primary mb-1">
                      Facebook
                    </label>
                    <input
                      type="text"
                      value={adminFormData.facebook}
                      onChange={(e) => setAdminFormData({ ...adminFormData, facebook: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 7: UPLOAD FOTO DARI GALERI HP / KOMPUTER */}
              <div className="space-y-4 pt-4 border-t border-outline-variant">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-lg">add_a_photo</span>
                  7. Upload Foto Usaha dari Galeri
                </h3>

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

              {/* Submit Button */}
              <div className="pt-6 border-t border-outline-variant flex justify-end">
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="bg-primary text-white py-3.5 px-8 rounded-xl font-bold text-xs hover:bg-primary/90 transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-lg">
                    {isPublishing ? "progress_activity" : "publish"}
                  </span>
                  {isPublishing ? "Memproses..." : (editingBusinessId ? "Simpan Perubahan UMKM" : "Publikasikan Usaha ke Halaman Utama")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: MANAJEMEN UMKM AKTIF TAYANG */}
        {activeTab === "active_list" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
              <div>
                <h2 className="text-2xl font-display font-extrabold text-primary mb-1">
                  Manajemen UMKM Aktif Tayang
                </h2>
                <p className="text-xs text-on-surface-variant font-light">
                  Daftar {businesses.length} usaha yang saat ini aktif tampil di Halaman Utama Isi Torang Gorontalo.
                </p>
              </div>
            </div>

            {/* Search Input for Active Businesses */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                type="text"
                placeholder="Cari nama usaha atau kategori aktif..."
                value={searchBusinesses}
                onChange={(e) => setSearchBusinesses(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-16 bg-surface rounded-2xl border border-outline-variant">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
                  search_off
                </span>
                <p className="text-base font-bold text-primary">UMKM Tidak Ditemukan</p>
                <p className="text-xs text-on-surface-variant">
                  {searchBusinesses ? "Tidak ada hasil yang cocok dengan pencarian Anda." : "Belum ada UMKM yang ditambahkan."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBusinesses.map((biz) => (
                <div
                  key={biz.id}
                  className="bg-surface rounded-2xl p-4 border border-outline-variant/60 shadow-card flex gap-4 items-center justify-between"
                >
                  <div className="flex gap-3 items-center min-w-0">
                    <img
                      src={biz.imageUrl}
                      alt={biz.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-surface-variant border border-outline-variant"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-primary text-sm truncate">{biz.name}</h4>
                      <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider block">
                        {biz.category}
                      </span>
                      <p className="text-[11px] text-on-surface-variant font-light truncate mt-0.5">
                        {biz.address || "Gorontalo"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Link
                      href={`/umkm/${biz.id}`}
                      target="_blank"
                      className="p-2 border border-outline-variant text-primary rounded-xl hover:bg-surface-variant transition-colors"
                      title="Lihat Halaman Detail"
                    >
                      <span className="material-symbols-outlined text-base">visibility</span>
                    </Link>
                    <button
                      onClick={() => handleEditBusiness(biz)}
                      className="p-2 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Edit UMKM"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm(`Yakin ingin menghapus ${biz.name} dari Halaman Utama?`)) {
                          try {
                            await deleteBusiness(biz.id);
                            toast.success("UMKM berhasil dihapus!");
                          } catch (e) {
                            toast.error("Gagal menghapus UMKM. Coba lagi.");
                          }
                        }
                      }}
                      className="p-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                      title="Hapus dari Beranda Utama"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
