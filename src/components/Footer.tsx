import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-outline-variant w-full py-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mt-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Logo Thrive GenBI UBMG"
          className="w-9 h-9 object-contain"
        />
        <span className="text-lg font-display text-primary tracking-tight font-bold">
          Isi Torang Gorontalo
        </span>
      </div>

      <nav className="flex flex-wrap justify-center gap-8">
        <Link
          className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium"
          href="#"
        >
          Kebijakan Privasi
        </Link>
        <Link
          className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium"
          href="#"
        >
          Syarat &amp; Ketentuan
        </Link>
        <Link
          className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium"
          href="#"
        >
          Bantuan
        </Link>
        <Link
          className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium"
          href="#daftar"
        >
          Daftarkan Bisnis
        </Link>
      </nav>

      <div className="text-sm text-on-surface-variant font-light text-center md:text-right">
        © {new Date().getFullYear()} Isi Torang Gorontalo. All rights reserved.
      </div>
    </footer>
  );
}
