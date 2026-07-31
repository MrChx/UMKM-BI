export interface SocialMedia {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  fullDescription?: string;
  imageUrl: string;
  galleryImages?: string[];
  menuImageUrl?: string;
  whatsapp: string;
  mapsUrl: string;
  address?: string;
  openingHours?: string;
  highlights?: string[];
  paymentMethods?: string[];
  deliveryServices?: string[];
  socialMedia?: SocialMedia;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
