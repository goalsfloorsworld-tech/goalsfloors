"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { logAdminActivity } from "./logger";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: "https://s3.ca-east-006.backblazeb2.com",
  region: "ca-east-006",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID as string,
    secretAccessKey: process.env.B2_APP_KEY as string,
  },
});

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

export type CatalogData = {
  id: string;
  slug: string;
  name: string;
  url: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string;
  created_at: string;
};

export async function getAdminCatalogs() {
  const role = await getRequesterRole();
  if (!role || (role !== "admin" && role !== "administrator" && role !== "team")) {
    return { success: false, error: "Unauthorized access" };
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.from("page_catalogs").select("*").order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data as CatalogData[] };
}

export async function addAdminCatalog(payload: Omit<CatalogData, "id" | "created_at">) {
  const role = await getRequesterRole();
  if (role !== "admin" && role !== "administrator") {
    return { success: false, error: "Unauthorized: Only admins can manage catalogs" };
  }

  const supabase = getSupabase();
  const dbPayload = {
    name: payload.name,
    slug: payload.slug,
    url: payload.url,
    image: payload.image,
    meta_title: payload.metaTitle,
    meta_description: payload.metaDescription,
    seo_keywords: payload.seoKeywords
  };
  const { error } = await supabase.from("page_catalogs").insert([dbPayload]);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminActivity("ADD_PRODUCT", { slug: payload.slug, productName: `Catalog PDF: ${payload.name}` });

  revalidatePath("/catalogs");
  revalidatePath("/sitemap.xml");
  return { success: true };
}

export async function deleteAdminCatalog(id: string) {
  const role = await getRequesterRole();
  if (role !== "admin" && role !== "administrator") {
    return { success: false, error: "Unauthorized: Only admins can manage catalogs" };
  }

  const supabase = getSupabase();
  
  // Get URL and name before deleting
  const { data } = await supabase.from("page_catalogs").select("name, url").eq("id", id).single();
  
  if (data?.url && data.url.includes("backblazeb2.com")) {
    try {
      const urlObj = new URL(data.url);
      const key = decodeURIComponent(urlObj.pathname.replace("/goals-floors-pdf/", "").replace(/^\//, ''));
      await s3Client.send(new DeleteObjectCommand({
        Bucket: "goals-floors-pdf",
        Key: key
      }));
    } catch (e) {
      console.error("Failed to delete PDF from B2:", e);
      // We don't fail the DB delete if B2 delete fails
    }
  }

  const { error } = await supabase.from("page_catalogs").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminActivity("DELETE_PRODUCT", { id, productName: `Catalog PDF: ${data?.name || 'Unknown'}` });

  revalidatePath("/catalogs");
  revalidatePath("/sitemap.xml");
  return { success: true };
}

export async function updateAdminCatalog(id: string, data: Partial<CatalogData>) {
  const role = await getRequesterRole();
  if (role !== "admin" && role !== "administrator") {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = getSupabase();
  const updatePayload: any = {
    name: data.name,
    slug: data.slug,
    meta_title: data.metaTitle,
    meta_description: data.metaDescription,
    seo_keywords: data.seoKeywords
  };

  if (data.image) {
    updatePayload.image = data.image;
  }

  const { error } = await supabase
    .from("page_catalogs")
    .update(updatePayload)
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminActivity("EDIT_PRODUCT", { id, productName: `Catalog PDF: ${data.name || 'Unknown'}` });

  revalidatePath("/catalogs");
  revalidatePath(`/catalogs/${data.slug}`);
  revalidatePath("/sitemap.xml");
  return { success: true };
}
export async function getB2PresignedUploadUrl(filename: string, fileType: string) {
  const role = await getRequesterRole();
  if (role !== "admin" && role !== "administrator") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
    const { HeadObjectCommand } = await import("@aws-sdk/client-s3");
    
    // First, check if the PDF already exists to prevent duplicate overwrites silently
    try {
      const headCmd = new HeadObjectCommand({
        Bucket: "goals-floors-pdf",
        Key: filename,
      });
      await s3Client.send(headCmd);
      // If this succeeds, the file already exists! We should block it.
      return { success: false, error: `A PDF named "${filename}" already exists in the bucket. Please change the Catalog Name to something unique.` };
    } catch (headError: any) {
      // If it throws a 404 (NotFound), that's good! It means no duplicate exists.
      if (headError.name !== "NotFound" && headError.$metadata?.httpStatusCode !== 404) {
        // Some other error occurred
        console.error("HeadObject check failed:", headError);
      }
    }

    const command = new PutObjectCommand({
      Bucket: "goals-floors-pdf",
      Key: filename,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const publicUrl = `https://goals-floors-pdf.s3.ca-east-006.backblazeb2.com/${encodeURIComponent(filename)}`;

    return { success: true, uploadUrl, publicUrl };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
