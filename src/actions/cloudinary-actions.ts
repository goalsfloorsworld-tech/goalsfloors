"use server";

import { v2 as cloudinary } from "cloudinary";
import { getCurrentUserProfile } from "@/actions/admin-core";
import { logAdminActivity } from "./logger";

export async function uploadDynamicProductImages(
  files: { base64: string; name: string }[],
  folderPath: string
) {
  cloudinary.config({
    cloud_name: process.env.ADMIN_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.ADMIN_CLOUDINARY_API_KEY,
    api_secret: process.env.ADMIN_CLOUDINARY_API_SECRET,
    secure: true,
  });

  try {
    // 1. Authorization check
    const userRes = await getCurrentUserProfile();
    if (!userRes.success || (userRes.profile?.role !== "admin" && userRes.profile?.role !== "administrator")) {
      return { success: false, error: "Unauthorized access" };
    }

    if (files.length === 0) {
      return { success: true, data: [] };
    }

    // 2. Check Storage limit
    try {
      const usageRes = await cloudinary.api.usage();
      const usedPercent = usageRes?.credits?.used_percent || 0;
      
      if (usedPercent > 98) {
        return { 
          success: false, 
          error: `Cloudinary storage (credits) is almost full (${Math.round(usedPercent)}%). Bhai, itna space nahi bacha, usme se kuch purani images hata do pehle.` 
        };
      }
    } catch (err) {
      console.error("Failed to check Cloudinary usage:", err);
      // Fallback, allow upload if usage check fails
    }

    // 3. Check for Duplicate Names
    const duplicateNames: string[] = [];
    
    await Promise.all(
      files.map(async (file) => {
        try {
          // If the resource exists, this will succeed. If not, it throws an error (404).
          await cloudinary.api.resource(`${folderPath}/${file.name}`);
          duplicateNames.push(file.name);
        } catch (error: any) {
          // 404 means it does not exist, which is what we want!
          if (error?.http_code !== 404 && error?.error?.http_code !== 404) {
             console.error(`Error checking resource ${file.name}:`, error?.message || error?.error?.message || "Unknown error");
          }
        }
      })
    );

    if (duplicateNames.length > 0) {
      return {
        success: false,
        error: `Yeh images ke naam pehle se hi hain Cloudinary par: ${duplicateNames.join(", ")}. Kripya name change karein.`
      };
    }

    // 4. Upload Files
    const uploadPromises = files.map(async (file) => {
      const uploadRes = await cloudinary.uploader.upload(file.base64, {
        folder: folderPath,
        public_id: file.name,
        overwrite: false, // Extra safety
      });
      
      // Auto-append q_auto,f_auto
      const secureUrl = uploadRes.secure_url;
      const optimizedUrl = secureUrl.replace("/upload/", "/upload/q_auto,f_auto/");
      
      return optimizedUrl;
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    // Log the activity
    await logAdminActivity('ADD_IMAGE', { count: files.length, folder: folderPath, files: files.map(f => f.name) });

    return { success: true, data: uploadedUrls };
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error?.message || error?.error?.message || "Unknown error");
    return { success: false, error: error?.message || error?.error?.message || "Failed to upload images." };
  }
}

export async function deleteCloudinaryImages(urls: string[]) {
  cloudinary.config({
    cloud_name: process.env.ADMIN_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.ADMIN_CLOUDINARY_API_KEY,
    api_secret: process.env.ADMIN_CLOUDINARY_API_SECRET,
    secure: true,
  });

  try {
    const userRes = await getCurrentUserProfile();
    if (!userRes.success || (userRes.profile?.role !== "admin" && userRes.profile?.role !== "administrator")) {
      return { success: false, error: "Unauthorized access" };
    }

    if (urls.length === 0) return { success: true };

    const deletePromises = urls.map(async (url) => {
      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const goalsfloorsIndex = pathname.indexOf('goalsfloors/');
        
        if (goalsfloorsIndex !== -1) {
          let public_id = pathname.substring(goalsfloorsIndex);
          // Remove extension if present
          const lastDot = public_id.lastIndexOf('.');
          if (lastDot !== -1) {
            public_id = public_id.substring(0, lastDot);
          }
          public_id = decodeURIComponent(public_id);
          const res = await cloudinary.uploader.destroy(public_id);
          console.log(`Deleted ${public_id} from Cloudinary:`, res);
        }
      } catch (err) {
        console.error("Invalid URL passed to delete:", url);
      }
    });

    await Promise.all(deletePromises);
    
    // Log Activity
    await logAdminActivity('DELETE_IMAGE', { count: urls.length, urls });

    return { success: true };
  } catch (error: any) {
    console.error("Cloudinary Delete Error:", error?.message || "Unknown error");
    return { success: false, error: "Failed to delete images from Cloudinary" };
  }
}

export async function checkCloudinaryDuplicate(name: string, folderPath: string) {
  cloudinary.config({
    cloud_name: process.env.ADMIN_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.ADMIN_CLOUDINARY_API_KEY,
    api_secret: process.env.ADMIN_CLOUDINARY_API_SECRET,
    secure: true,
  });

  try {
    await cloudinary.api.resource(`${folderPath}/${name}`);
    return { exists: true };
  } catch (error: any) {
    if (error?.http_code === 404 || error?.error?.http_code === 404) {
      return { exists: false };
    }
    return { exists: false, error: "Cloudinary error" };
  }
}
