"use server";

import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { logAdminActivity } from "./logger";

// Cloudinary configuration (isolated and robust)
cloudinary.config({
  cloud_name: process.env.ADMIN_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.ADMIN_CLOUDINARY_API_KEY,
  api_secret: process.env.ADMIN_CLOUDINARY_API_SECRET,
});

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function verifyAdminRole(): Promise<{ userId: string; role: string } | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  const role = data?.role;
  if (!role || (role !== "admin" && role !== "administrator")) {
    return null;
  }

  return { userId, role };
}

export interface PromoGalleryImage {
  id: string;
  title: string;
  url: string;
  category?: string;
  source: "uploaded" | "installed" | "preset";
}

// Curated high-res presets for festive, flooring, and wall panels
const CURATED_PROMO_PRESETS: PromoGalleryImage[] = [
  {
    id: "preset-fluted-tv",
    title: "Fluted Wall Panel TV Wall",
    url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775411703/Luxury_Penthouse_Living_Room_with_Light_Oak_Herringbone_Flooring_Gurugram.jpg",
    category: "Wall Panels",
    source: "preset",
  },
  {
    id: "preset-spc-bedroom",
    title: "Wooden SPC Floor Bedroom",
    url: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1775544853/oak_color_laminate_flooring_installed_images.png",
    category: "SPC Flooring",
    source: "preset",
  },
  {
    id: "preset-balcony-grass",
    title: "Green Balcony Flooring",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    category: "Balcony Grass",
    source: "preset",
  },
  {
    id: "preset-herringbone-living",
    title: "Herringbone Floor Living Room",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    category: "Herringbone",
    source: "preset",
  },
  {
    id: "preset-wpc-exterior",
    title: "WPC Louver Exterior Wall",
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    category: "Exterior Louvers",
    source: "preset",
  },
  {
    id: "preset-commercial-office",
    title: "Corporate Offices Flooring",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    category: "B2B Commercial",
    source: "preset",
  },
  {
    id: "preset-restaurant-dining",
    title: "Luxury Restaurants Wooden Floor",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    category: "Hospitality",
    source: "preset",
  },
  {
    id: "preset-luxury-hotel",
    title: "5-Star Hotel Lobby Flooring",
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    category: "Hotels",
    source: "preset",
  },
  {
    id: "preset-retail-store",
    title: "Retail Stores & Showrooms",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    category: "Retail",
    source: "preset",
  },
  {
    id: "preset-modern-penthouse",
    title: "Modern Minimalist Penthouse",
    url: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80",
    category: "Luxury Flooring",
    source: "preset",
  },
];

/**
 * Upload promo banner image to Cloudinary (folder: goalsfloors/uploads/promos)
 * Constraints:
 * - Max file size: 2MB (strictly enforced)
 * - Ratio: ideally 4:3 (displayed object-cover)
 * - Duplicate check: Rejects with error if an image with the same name already exists in Cloudinary
 */
export async function uploadPromoImage(
  formData: FormData
): Promise<{ success: boolean; secure_url?: string; error?: string; filename?: string }> {
  try {
    const authUser = await verifyAdminRole();
    if (!authUser) {
      return { success: false, error: "Unauthorized: Administrator permissions required." };
    }

    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No image file provided." };
    }

    // 1. Enforce strict 2MB limit
    const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      return {
        success: false,
        error: `File size too large (${sizeMb} MB). Maximum allowed size is 2 MB. Please compress or choose a smaller image.`,
      };
    }

    // 2. Enforce image MIME types
    if (!file.type || !file.type.startsWith("image/")) {
      return {
        success: false,
        error: "Invalid file type. Only image files (PNG, JPG, WEBP, AVIF) are allowed.",
      };
    }

    const originalFileName = file.name;
    const nameWithoutExt = originalFileName.substring(0, originalFileName.lastIndexOf(".")) || originalFileName;
    const sanitizedFileName = nameWithoutExt
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!sanitizedFileName) {
      return { success: false, error: "Invalid filename. Please use letters and numbers in the filename." };
    }

    const folderName = "promos";
    const expectedPublicId = `goalsfloors/uploads/${folderName}/${sanitizedFileName}`;

    // 3. Duplicate filename check: reject if already uploaded in Cloudinary
    try {
      await cloudinary.api.resource(expectedPublicId);
      return {
        success: false,
        error: `An image named "${originalFileName}" is already uploaded. Please rename the file before uploading.`,
      };
    } catch {
      // 404 resource not found means file does not exist, which is expected and good to proceed!
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `goalsfloors/uploads/${folderName}`,
          public_id: sanitizedFileName,
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        async (error, result) => {
          if (error || !result) {
            console.error("Cloudinary Promo Upload Error:", error);
            resolve({ success: false, error: error?.message || "Failed to upload image to Cloudinary." });
          } else {
            await logAdminActivity("UPLOAD_PROMO_IMAGE", {
              filename: originalFileName,
              url: result.secure_url,
              public_id: result.public_id,
            });
            resolve({ success: true, secure_url: result.secure_url, filename: originalFileName });
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("uploadPromoImage exception:", message);
    return { success: false, error: message || "Server error while uploading image." };
  }
}

export interface UploadPromoImagesResult {
  success: boolean;
  urls?: string[];
  uploaded?: { filename: string; url: string; public_id: string }[];
  error?: string;
}

/**
 * Upload multiple promotional banner images simultaneously (Max 4 images).
 * All-or-nothing validation:
 * 1. Maximum 4 files allowed.
 * 2. Every file must be <= 2MB strictly.
 * 3. If even one file already exists in Cloudinary (or exceeds 2MB), ALL uploads are rejected immediately.
 */
export async function uploadPromoImages(formData: FormData): Promise<UploadPromoImagesResult> {
  try {
    const authUser = await verifyAdminRole();
    if (!authUser) {
      return { success: false, error: "Unauthorized: Admin privileges required." };
    }

    // Extract files from formData
    const rawFiles = formData.getAll("files");
    const files: File[] = [];

    for (const item of rawFiles) {
      if (item instanceof File && item.size > 0) {
        files.push(item);
      }
    }

    // Fallback if sent as single 'file'
    if (files.length === 0) {
      const single = formData.get("file");
      if (single instanceof File && single.size > 0) {
        files.push(single);
      }
    }

    if (files.length === 0) {
      return { success: false, error: "No image files selected for upload." };
    }

    // 1. Strict limit: Maximum 4 images at a time
    if (files.length > 4) {
      return {
        success: false,
        error: `Maximum 4 images allowed per batch. You selected ${files.length} images.`,
      };
    }

    const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
    const folderName = "promos";
    const batchSeenNames = new Set<string>();

    interface PreparedFile {
      file: File;
      originalFileName: string;
      sanitizedFileName: string;
      expectedPublicId: string;
    }

    const preparedFiles: PreparedFile[] = [];

    // 2. Validate all files for size, mime type, and batch duplication
    for (const file of files) {
      if (file.size > MAX_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        return {
          success: false,
          error: `File "${file.name}" exceeds the 2MB size limit (${sizeMb} MB). All uploads cancelled. Please ensure all files are under 2MB.`,
        };
      }

      if (!file.type || !file.type.startsWith("image/")) {
        return {
          success: false,
          error: `File "${file.name}" is not a valid image format. All uploads cancelled. Only PNG, JPG, and WEBP images are allowed.`,
        };
      }

      const originalFileName = file.name;
      const nameWithoutExt = originalFileName.substring(0, originalFileName.lastIndexOf(".")) || originalFileName;
      const sanitizedFileName = nameWithoutExt
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      if (!sanitizedFileName) {
        return {
          success: false,
          error: `File "${file.name}" has an invalid filename. Please use letters and numbers in filenames.`,
        };
      }

      if (batchSeenNames.has(sanitizedFileName)) {
        return {
          success: false,
          error: `Duplicate file "${file.name}" detected within the selected files. All uploads cancelled.`,
        };
      }
      batchSeenNames.add(sanitizedFileName);

      const expectedPublicId = `goalsfloors/uploads/${folderName}/${sanitizedFileName}`;
      preparedFiles.push({
        file,
        originalFileName,
        sanitizedFileName,
        expectedPublicId,
      });
    }

    // 3. Pre-check Cloudinary for duplicate names on ALL files
    // If even one file already exists, cancel everything!
    for (const item of preparedFiles) {
      try {
        await cloudinary.api.resource(item.expectedPublicId);
        return {
          success: false,
          error: `An image named "${item.originalFileName}" has already been uploaded previously. All uploads cancelled. Please rename the file before trying again.`,
        };
      } catch {
        // 404 indicates file does not exist yet, which is safe to proceed
      }
    }

    // 4. All validations passed! Upload each file to Cloudinary in parallel
    const uploadPromises = preparedFiles.map(async (item) => {
      const bytes = await item.file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      return new Promise<{ filename: string; url: string; public_id: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `goalsfloors/uploads/${folderName}`,
            public_id: item.sanitizedFileName,
            transformation: [{ quality: "auto", fetch_format: "auto" }],
          },
          async (error, result) => {
            if (error || !result) {
              reject(new Error(error?.message || `Failed to upload "${item.originalFileName}" to Cloudinary.`));
            } else {
              await logAdminActivity("UPLOAD_PROMO_IMAGE", {
                filename: item.originalFileName,
                url: result.secure_url,
                public_id: result.public_id,
              });
              resolve({
                filename: item.originalFileName,
                url: result.secure_url,
                public_id: result.public_id,
              });
            }
          }
        );
        uploadStream.end(buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    const urls = results.map((r) => r.url);

    return {
      success: true,
      urls,
      uploaded: results,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("uploadPromoImages exception:", message);
    return { success: false, error: message || "Server error while uploading images." };
  }
}

/**
 * Fetch available images for promotional banners:
 * Combines previously uploaded promo images, installed product images, and curated presets.
 */
export async function getPromoImageLibrary(): Promise<{
  success: boolean;
  images: PromoGalleryImage[];
  error?: string;
}> {
  try {
    const authUser = await verifyAdminRole();
    if (!authUser) {
      return { success: false, images: [], error: "Unauthorized" };
    }

    const supabase = getSupabaseAdmin();
    const allImages: PromoGalleryImage[] = [];
    const seenUrls = new Set<string>();

    const addUnique = (item: PromoGalleryImage) => {
      if (!item.url || seenUrls.has(item.url.trim())) return;
      seenUrls.add(item.url.trim());
      allImages.push(item);
    };

    // 1. Cloudinary Uploaded Promo Images
    try {
      const cloudRes = await cloudinary.api.resources({
        type: "upload",
        prefix: "goalsfloors/uploads/promos",
        max_results: 50,
      });

      for (const r of cloudRes.resources || []) {
        const title = r.public_id.split("/").pop()?.replace(/-/g, " ") || "Promo Upload";
        addUnique({
          id: `cloud-${r.public_id}`,
          title: title.charAt(0).toUpperCase() + title.slice(1),
          url: r.secure_url,
          category: "Uploaded Promos",
          source: "uploaded",
        });
      }
    } catch (cErr) {
      console.warn("Could not query Cloudinary promos folder:", cErr);
    }

    // 2. Installed Product Images from Supabase
    try {
      const { data: installed } = await supabase
        .from("page_installed_images")
        .select("id, page_slug, image_url, alt_text")
        .order("created_at", { ascending: false })
        .limit(40);

      for (const img of installed || []) {
        addUnique({
          id: `inst-${img.id}`,
          title: img.alt_text || img.page_slug || "Installed Project",
          url: img.image_url,
          category: img.page_slug ? `Product: ${img.page_slug}` : "Installed Images",
          source: "installed",
        });
      }
    } catch (sErr) {
      console.warn("Could not query page_installed_images:", sErr);
    }

    // 3. Curated Presets
    for (const preset of CURATED_PROMO_PRESETS) {
      addUnique(preset);
    }

    return { success: true, images: allImages };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("getPromoImageLibrary exception:", message);
    return { success: false, images: CURATED_PROMO_PRESETS, error: message };
  }
}
