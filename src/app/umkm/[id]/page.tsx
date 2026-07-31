import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import DetailClientActions from "@/components/DetailClientActions";
import UmkmFacilitiesCard from "@/components/UmkmFacilitiesCard";
import { mapBusinessFromDb } from "@/app/api/businesses/route";
import { createServerSupabaseClient } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getBusinessById(id: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapBusinessFromDb(data as Record<string, unknown>);
}

async function getRelatedBusinesses(currentId: string, category: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("businesses")
    .select("id, name, category, description, image_url")
    .neq("id", currentId)
    .eq("category", category)
    .limit(3);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    category: row.category as string,
    description: row.description as string,
    imageUrl: row.image_url as string,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const item = await getBusinessById(id);
  if (!item) {
    return { title: "UMKM Tidak Ditemukan - Isi Torang Gorontalo" };
  }
  return {
    title: `${item.name} - Isi Torang Gorontalo`,
    description: item.description,
  };
}

export default async function UmkmDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getBusinessById(id);

  if (!item) {
    notFound();
  }

  const relatedItems = await getRelatedBusinesses(id, item.category);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background antialiased font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Back Button */}
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Kembali ke Beranda
          </Link>
        </div>

        {/* Hero Image */}
        <div className="w-full h-64 md:h-96 bg-surface-variant overflow-hidden mt-4">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Content */}
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Category */}
            <div>
              <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                {item.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-primary mt-1 mb-3">
                {item.name}
              </h1>
              {item.address && (
                <p className="text-sm text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  {item.address}
                </p>
              )}
              {item.openingHours && (
                <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  {item.openingHours}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none text-on-surface-variant leading-relaxed">
              <p>{item.fullDescription || item.description}</p>
            </div>

            {/* Menu & Fasilitas */}
            {((item.highlights && item.highlights.length > 0) || item.menuImageUrl) && (
              <div className="bg-surface rounded-2xl p-5 border border-outline-variant/60 shadow-card">
                <h2 className="text-base font-display font-bold text-primary mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">menu_book</span>
                  Menu & Fasilitas
                </h2>
                
                {item.highlights && item.highlights.length > 0 && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                {item.menuImageUrl && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">Foto Menu / Fasilitas LENGKAP</p>
                    <div className="rounded-xl overflow-hidden border border-outline-variant/60 bg-surface-variant">
                      <img 
                        src={item.menuImageUrl} 
                        alt={`Menu lengkap ${item.name}`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Facilities Card (Payment, Delivery, Social Media) */}
            <UmkmFacilitiesCard
              paymentMethods={item.paymentMethods ?? []}
              deliveryServices={item.deliveryServices ?? []}
              socialMedia={item.socialMedia ?? {}}
            />

            {/* Gallery */}
            {item.galleryImages && item.galleryImages.length > 0 && (
              <div>
                <h2 className="text-base font-display font-bold text-primary mb-3">
                  Galeri Foto
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {item.galleryImages.map((img, i) => (
                    <div key={i} className="h-40 rounded-xl overflow-hidden bg-surface-variant">
                      <img
                        src={img}
                        alt={`${item.name} gallery ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Contact Card */}
          <div className="space-y-4">
            <div className="bg-surface rounded-2xl p-6 border border-outline-variant/60 shadow-card sticky top-24 space-y-4">
              <h2 className="text-base font-display font-bold text-primary">
                Hubungi Langsung
              </h2>
              <DetailClientActions
                whatsapp={item.whatsapp}
                mapsUrl={item.mapsUrl}
                name={item.name}
              />
            </div>
          </div>
        </div>

        {/* Related Businesses */}
        {relatedItems.length > 0 && (
          <div className="bg-surface-container py-10 mt-6">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
              <h2 className="text-xl font-display font-bold text-primary mb-5">
                Usaha Serupa di Kategori {item.category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {relatedItems.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/umkm/${rel.id}`}
                    className="bg-surface rounded-2xl overflow-hidden border border-outline-variant/60 shadow-card hover:shadow-md hover:-translate-y-1 transition-all"
                  >
                    <div className="h-36 overflow-hidden bg-surface-variant">
                      <img
                        src={rel.imageUrl}
                        alt={rel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                        {rel.category}
                      </span>
                      <h3 className="font-bold text-primary text-sm mt-0.5">{rel.name}</h3>
                      <p className="text-xs text-on-surface-variant font-light mt-1 line-clamp-2">
                        {rel.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
