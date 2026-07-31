import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const businesses = (data ?? []).map(mapBusinessFromDb);
  return NextResponse.json({ businesses });
}

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("businesses")
    .insert([mapBusinessToDb(body)])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ business: mapBusinessFromDb(data) }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  const { error } = await supabase.from("businesses").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const body = await req.json();

  if (!body.id) {
    return NextResponse.json({ error: "Missing id in body" }, { status: 400 });
  }

  const dbData = mapBusinessToDb(body);
  const { id: _, ...updateData } = dbData as Record<string, unknown>; // Extract ID out

  const { data, error } = await supabase
    .from("businesses")
    .update(updateData)
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ business: mapBusinessFromDb(data) }, { status: 200 });
}

export function mapBusinessFromDb(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as string,
    description: row.description as string,
    fullDescription: row.full_description as string,
    imageUrl: row.image_url as string,
    galleryImages: (row.gallery_images as string[]) ?? [],
    menuImageUrl: row.menu_image_url as string | undefined,
    whatsapp: row.whatsapp as string,
    mapsUrl: row.maps_url as string,
    address: row.address as string,
    openingHours: row.opening_hours as string,
    highlights: (row.highlights as string[]) ?? [],
    paymentMethods: (row.payment_methods as string[]) ?? [],
    deliveryServices: (row.delivery_services as string[]) ?? [],
    socialMedia: {
      instagram: row.instagram as string | undefined,
      tiktok: row.tiktok as string | undefined,
      facebook: row.facebook as string | undefined,
    },
    featured: row.featured as boolean,
    createdAt: row.created_at as string,
  };
}

function mapBusinessToDb(b: Record<string, unknown>) {
  const socialMedia = b.socialMedia as Record<string, string> | undefined;
  return {
    name: b.name,
    category: b.category,
    description: b.description,
    full_description: b.fullDescription ?? b.description,
    image_url: b.imageUrl,
    gallery_images: b.galleryImages ?? [],
    menu_image_url: b.menuImageUrl ?? null,
    whatsapp: b.whatsapp,
    maps_url: b.mapsUrl,
    address: b.address,
    opening_hours: b.openingHours,
    highlights: b.highlights ?? [],
    payment_methods: b.paymentMethods ?? [],
    delivery_services: b.deliveryServices ?? [],
    instagram: socialMedia?.instagram ?? null,
    tiktok: socialMedia?.tiktok ?? null,
    facebook: socialMedia?.facebook ?? null,
    featured: b.featured ?? true,
  };
}
