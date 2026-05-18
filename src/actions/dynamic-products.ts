"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { publishToGmc } from "./gmc-publisher";

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

export async function addDynamicProduct(slug: string, jsonPayload: any) {
  try {
    const role = await getRequesterRole();
    if (role !== "admin" && role !== "administrator") {
      throw new Error("Unauthorized: Only Administrators can modify dynamic products.");
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("page_products")
      .insert([{ page_slug: slug, product_data: jsonPayload }])
      .select()
      .single();

    if (error) throw error;

    // GMC Push Logic
    if (jsonPayload.push_to_gmc && Array.isArray(jsonPayload.images)) {
      await Promise.allSettled(
        jsonPayload.images.map((img: any) =>
          publishToGmc({
            offerId: `${data.id}-${(img.name || 'variant').replace(/\s+/g, '-').toLowerCase()}`,
            title: img.gmc_title || `${jsonPayload.name} - ${img.name || 'Variant'}`,
            description: img.gmc_variant_description || jsonPayload.gmc_description || "Premium flooring/panel",
            link: `https://goalsfloors.com/products/${slug}`,
            imageLink: img.url,
            price: jsonPayload.priceValue.toString(),
            itemGroupId: data.id
          })
        )
      );
    }

    return { success: true as const, data };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function getDynamicProducts() {
  try {
    const role = await getRequesterRole();
    if (!role) {
      throw new Error("Unauthorized");
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("page_products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true as const, data: data || [] };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function updateDynamicProduct(id: string, slug: string, jsonPayload: any) {
  try {
    const role = await getRequesterRole();
    if (role !== "admin" && role !== "administrator") {
      throw new Error("Unauthorized: Only Administrators can modify dynamic products.");
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("page_products")
      .update({ page_slug: slug, product_data: jsonPayload })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // GMC Push Logic
    if (jsonPayload.push_to_gmc && Array.isArray(jsonPayload.images)) {
      await Promise.allSettled(
        jsonPayload.images.map((img: any) =>
          publishToGmc({
            offerId: `${data.id}-${(img.name || 'variant').replace(/\s+/g, '-').toLowerCase()}`,
            title: img.gmc_title || `${jsonPayload.name} - ${img.name || 'Variant'}`,
            description: img.gmc_variant_description || jsonPayload.gmc_description || "Premium flooring/panel",
            link: `https://goalsfloors.com/products/${slug}`,
            imageLink: img.url,
            price: jsonPayload.priceValue.toString(),
            itemGroupId: data.id
          })
        )
      );
    }

    return { success: true as const, data };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function deleteDynamicProduct(id: string) {
  try {
    const role = await getRequesterRole();
    if (role !== "admin" && role !== "administrator") {
      throw new Error("Unauthorized: Only Administrators can modify dynamic products.");
    }
    const supabase = getSupabase();
    const { error } = await supabase
      .from("page_products")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { success: true as const };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}
