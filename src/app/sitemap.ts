import { MetadataRoute } from "next";
import { createServerSupabaseClient } from "@/lib/supabase";

const SITE_URL = "https://isitoranggorontalo.web.id";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.1,
    },
  ];

  // Dynamic routes from database
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("businesses")
      .select("id, created_at")
      .order("created_at", { ascending: false });

    const dynamicRoutes: MetadataRoute.Sitemap = (data ?? []).map((biz) => ({
      url: `${SITE_URL}/umkm/${biz.id}`,
      lastModified: new Date(biz.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
