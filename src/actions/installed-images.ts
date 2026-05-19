'use server';

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

export async function addInstalledImage(payload: {
  page_slug: string;
  image_url: string;
  alt_text: string;
  aspect_ratio: string;
}) {
  const role = await getRequesterRole();
  
  if (role !== 'admin' && role !== 'administrator') {
    return { success: false, error: 'Unauthorized: Only Administrators can modify installed images.' };
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from('page_installed_images')
    .insert([
      {
        page_slug: payload.page_slug,
        image_url: payload.image_url,
        alt_text: payload.alt_text,
        aspect_ratio: payload.aspect_ratio,
      }
    ]);

  if (error) {
    console.error("Error adding installed image:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/products/${payload.page_slug}`);
  revalidatePath('/sitemap.xml');
  return { success: true };
}

export async function getInstalledImages() {
  const role = await getRequesterRole();
  if (role !== 'admin' && role !== 'administrator' && role !== 'team') {
    return { success: false, error: 'Unauthorized', data: [] };
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('page_installed_images')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching installed images:", error);
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data || [] };
}

export async function deleteInstalledImage(id: string, page_slug: string) {
  const role = await getRequesterRole();
  if (role !== 'admin' && role !== 'administrator') {
    return { success: false, error: 'Unauthorized' };
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from('page_installed_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting installed image:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/products/${page_slug}`);
  revalidatePath('/sitemap.xml');
  return { success: true };
}
