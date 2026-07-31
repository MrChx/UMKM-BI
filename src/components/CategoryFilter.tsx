"use client";

import { CATEGORIES } from "@/data/mockData";

interface CategoryFilterProps {
  activeCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryFilter({
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <section id="kategori" className="py-12 bg-surface">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 md:flex md:overflow-x-auto md:gap-8 md:justify-center md:pb-4 md:scrollbar-hide">
          <button
            onClick={() => onSelectCategory(null)}
            className={`flex flex-col items-center gap-3 min-w-0 md:min-w-[70px] group cursor-pointer border-none bg-transparent`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                activeCategory === null
                  ? "bg-primary text-secondary ring-2 ring-secondary shadow-md"
                  : "bg-surface-variant text-primary group-hover:bg-primary/10 group-hover:text-secondary"
              }`}
            >
              <span className="material-symbols-outlined text-xl">apps</span>
            </div>
            <span
              className={`text-sm font-medium transition-colors ${
                activeCategory === null
                  ? "text-primary font-semibold"
                  : "text-on-surface-variant group-hover:text-primary"
              }`}
            >
              Semua
            </span>
          </button>

          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isActive ? null : cat.id)}
                className="flex flex-col items-center gap-3 min-w-0 md:min-w-[70px] group cursor-pointer border-none bg-transparent"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-secondary ring-2 ring-secondary shadow-md"
                      : "bg-surface-variant text-primary group-hover:bg-primary/10 group-hover:text-secondary"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl" data-icon={cat.icon}>
                    {cat.icon}
                  </span>
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-on-surface-variant group-hover:text-primary"
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
