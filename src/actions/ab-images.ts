'use server';

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { deleteImageFromCloudinary } from "./cloudinary";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function getRequesterRole(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const supabase = getSupabase();
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
  return data?.role ?? null;
}

export async function addAbImage(payload: {
  page_slug: string;
  before_url: string;
  before_alt: string;
  after_url: string;
  after_alt: string;
  primary_thumbnail: string;
  placement: string;
  demote_id?: string;
}) {
  const role = await getRequesterRole();
  
  if (role !== 'admin' && role !== 'administrator') {
    return { success: false, error: 'Unauthorized: Only Administrators can modify A/B images.' };
  }

  const supabase = getSupabase();

  if (payload.demote_id) {
    const { error: demoteError } = await supabase
      .from('page_ab_images')
      .update({ placement: 'gallery' })
      .eq('id', payload.demote_id);
      
    if (demoteError) {
      console.error("Error demoting A/B image:", demoteError);
      return { success: false, error: demoteError.message };
    }
  }

  const { error } = await supabase
    .from('page_ab_images')
    .insert([
      {
        page_slug: payload.page_slug,
        before_url: payload.before_url,
        before_alt: payload.before_alt,
        after_url: payload.after_url,
        after_alt: payload.after_alt,
        primary_thumbnail: payload.primary_thumbnail,
        placement: payload.placement || 'gallery',
      }
    ]);

  if (error) {
    console.error("Error adding A/B image:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/products/${payload.page_slug}`);
  revalidatePath('/sitemap.xml');
  return { success: true };
}

export async function getAbImages() {
  const role = await getRequesterRole();
  if (role !== 'admin' && role !== 'administrator' && role !== 'team') {
    return { success: false, error: 'Unauthorized', data: [] };
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('page_ab_images')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching A/B images:", error);
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data || [] };
}

export async function deleteAbImage(id: string, page_slug: string) {
  const role = await getRequesterRole();
  if (role !== 'admin' && role !== 'administrator') {
    return { success: false, error: 'Unauthorized' };
  }

  const supabase = getSupabase();
  
  // Fetch both URLs to delete them from Cloudinary
  const { data: record, error: fetchError } = await supabase
    .from('page_ab_images')
    .select('before_url, after_url')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error("Error fetching record for deletion:", fetchError);
    return { success: false, error: fetchError.message };
  }
  
  if (record) {
    if (record.before_url) await deleteImageFromCloudinary(record.before_url);
    if (record.after_url) await deleteImageFromCloudinary(record.after_url);
  }

  const { error } = await supabase
    .from('page_ab_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting A/B image:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/products/${page_slug}`);
  revalidatePath('/sitemap.xml');
  return { success: true };
}
