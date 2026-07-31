"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem("admin_authenticated", "true");
        router.push("/admin");
      } else {
        setErrorMsg(data.error ?? "Email atau password salah.");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan koneksi. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container flex flex-col justify-center items-center py-12 px-margin-mobile relative overflow-hidden font-sans">
      {/* Background Decorative Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

      {/* Top Back Link */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors bg-surface px-4 py-2 rounded-xl shadow-sm border border-outline-variant"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Kembali ke Beranda
        </Link>
      </div>

      <div className="w-full max-w-md bg-surface rounded-3xl p-8 md:p-10 shadow-soft border border-outline-variant/60 relative z-10">
        {/* Header Logo & Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <img
              src="/logo.png"
              alt="Logo Thrive GenBI UBMG"
              className="w-20 h-20 object-contain mx-auto drop-shadow-md hover:scale-105 transition-transform"
            />
          </Link>
          <h1 className="text-2xl md:text-3xl font-display font-extrabold text-primary tracking-tight mb-2">
            Admin Portal
          </h1>
          <p className="text-sm text-on-surface-variant font-light">
            Masuk untuk mengelola direktori usaha & UMKM Isi Torang Gorontalo.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-xs font-medium border border-red-200 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-lg shrink-0">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">
              Email Admin
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-xl select-none">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@isitorang.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-primary mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-xl select-none">
                lock
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-medium text-sm hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 active:scale-95"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">
                  progress_activity
                </span>
                Memverifikasi...
              </>
            ) : (
              <>
                Masuk Admin
                <span className="material-symbols-outlined text-lg">login</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant text-center text-xs text-on-surface-variant font-light">
          Halaman ini khusus untuk Pengelola & Admin Resmi Isi Torang Gorontalo.
        </div>
      </div>
    </div>
  );
}
