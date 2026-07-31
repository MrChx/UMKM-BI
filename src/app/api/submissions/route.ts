import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const submissions = (data ?? []).map(mapSubmissionFromDb);
  return NextResponse.json({ submissions });
}

export async function POST(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("submissions")
    .insert([mapSubmissionToDb(body)])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ submission: mapSubmissionFromDb(data) }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { id, status } = await req.json();

  if (!id || !status) {
    return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
  }

  const { error } = await supabase
    .from("submissions")
    .update({ status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  const { error } = await supabase.from("submissions").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export function mapSubmissionFromDb(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    businessName: row.business_name as string,
    category: row.category as string,
    description: row.description as string,
    address: row.address as string,
    geotagging: row.geotagging as string,
    whatsapp: row.whatsapp as string,
    openingHours: row.opening_hours as string,
    paymentMethods: (row.payment_methods as string[]) ?? [],
    deliveryServices: (row.delivery_services as string[]) ?? [],
    instagram: row.instagram as string | undefined,
    tiktok: row.tiktok as string | undefined,
    facebook: row.facebook as string | undefined,
    thumbnailUrl: row.thumbnail_url as string,
    galleryUrls: (row.gallery_urls as string[]) ?? [],
    menuImageUrl: row.menu_image_url as string | undefined,
    status: row.status as "pending" | "approved" | "rejected",
    submittedAt: row.submitted_at as string,
  };
}

function mapSubmissionToDb(s: Record<string, unknown>) {
  return {
    business_name: s.businessName,
    category: s.category,
    description: s.description,
    address: s.address,
    geotagging: s.geotagging,
    whatsapp: s.whatsapp,
    opening_hours: s.openingHours,
    payment_methods: s.paymentMethods ?? [],
    delivery_services: s.deliveryServices ?? [],
    instagram: s.instagram ?? null,
    tiktok: s.tiktok ?? null,
    facebook: s.facebook ?? null,
    thumbnail_url: s.thumbnailUrl ?? null,
    gallery_urls: s.galleryUrls ?? [],
    menu_image_url: s.menuImageUrl ?? null,
    status: "pending",
  };
}
