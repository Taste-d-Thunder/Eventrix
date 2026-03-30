/**
 * lib/vendorStore.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Local storage data access layer for Vendor customized packages & photos.
 * 
 * Includes commented-out Supabase integration as requested, to be connected later.
 */

// import { supabase, isSupabaseConfigured } from "./supabase";

const VENDOR_PACKAGES_KEY = "eventspace_vendor_packages";
const VENDOR_PHOTOS_KEY = "eventspace_vendor_photos";

export interface VendorPackage {
  id: string;
  name: string;
  price: number | string;
  unit: string;
  description: string;
  includes: string[];
  image?: string;
  popular?: boolean;
}

// ─── PACKAGES ──────────────────────────────────────────────────────────────

export async function getVendorPackages(vendorId: string): Promise<VendorPackage[]> {
  /*
  // FUTURE SUPABASE INTEGRATION:
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from("vendor_packages")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data.map(row => ({
      id: row.id,
      name: row.name,
      price: row.price,
      unit: row.unit,
      description: row.description,
      includes: row.includes || [],
      image: row.image,
      popular: row.popular
    }));
  }
  */

  // localStorage implementation
  try {
    const raw = localStorage.getItem(VENDOR_PACKAGES_KEY);
    const allPackages: Record<string, VendorPackage[]> = raw ? JSON.parse(raw) : {};
    return allPackages[vendorId] || [];
  } catch {
    return [];
  }
}

export async function saveVendorPackages(vendorId: string, packages: VendorPackage[]): Promise<void> {
  /*
  // FUTURE SUPABASE INTEGRATION:
  if (isSupabaseConfigured() && supabase) {
    // Basic sync: delete old packages, insert new packages
    await supabase.from("vendor_packages").delete().eq("vendor_id", vendorId);
    
    if (packages.length > 0) {
      const inserts = packages.map(p => ({
        id: p.id,
        vendor_id: vendorId,
        name: p.name,
        price: p.price,
        unit: p.unit,
        description: p.description,
        includes: p.includes,
        image: p.image,
        popular: p.popular
      }));
      const { error } = await supabase.from("vendor_packages").insert(inserts);
      if (error) throw error;
    }
    return;
  }
  */

  // localStorage implementation
  const raw = localStorage.getItem(VENDOR_PACKAGES_KEY);
  const allPackages: Record<string, VendorPackage[]> = raw ? JSON.parse(raw) : {};
  allPackages[vendorId] = packages;
  localStorage.setItem(VENDOR_PACKAGES_KEY, JSON.stringify(allPackages));
}


// ─── PHOTOS (GALLERY) ────────────────────────────────────────────────────────

export async function getVendorPhotos(vendorId: string): Promise<string[]> {
  /*
  // FUTURE SUPABASE INTEGRATION:
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from("profiles")
      .select("shop_photos")
      .eq("id", vendorId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data?.shop_photos || [];
  }
  */

  // localStorage implementation
  try {
    const raw = localStorage.getItem(VENDOR_PHOTOS_KEY);
    const allPhotos: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    return allPhotos[vendorId] || [];
  } catch {
    return [];
  }
}

export async function saveVendorPhotos(vendorId: string, photos: string[]): Promise<void> {
  /*
  // FUTURE SUPABASE INTEGRATION:
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from("profiles")
      .update({ shop_photos: photos })
      .eq("id", vendorId);
      
    if (error) throw error;
    return;
  }
  */

  // localStorage implementation
  const raw = localStorage.getItem(VENDOR_PHOTOS_KEY);
  const allPhotos: Record<string, string[]> = raw ? JSON.parse(raw) : {};
  allPhotos[vendorId] = photos;
  localStorage.setItem(VENDOR_PHOTOS_KEY, JSON.stringify(allPhotos));
}
