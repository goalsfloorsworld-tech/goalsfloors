"use server";

import { v2 as cloudinary } from "cloudinary";
import { getCurrentUserProfile } from '@/actions/admin/core';

// Ensure Cloudinary is configured with admin credentials
cloudinary.config({
  cloud_name: process.env.ADMIN_CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.ADMIN_CLOUDINARY_API_KEY,
  api_secret: process.env.ADMIN_CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryAsset {
  public_id: string;
  filename: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  folder?: string;
  created_at: string;
}

export interface CloudinaryFolder {
  name: string;
  path: string;
}

/**
 * Fetch all available folders from Cloudinary account recursively
 */
export async function getCloudinaryFolders(): Promise<{
  success: boolean;
  folders: CloudinaryFolder[];
  error?: string;
}> {
  try {
    const userRes = await getCurrentUserProfile();
    if (!userRes.success || !userRes.profile) {
      return { success: false, folders: [], error: "Unauthorized access" };
    }

    const folderList: CloudinaryFolder[] = [{ name: "All Folders", path: "" }];

    async function fetchSubfolders(parentPath: string, parentLabel: string, depth = 0) {
      if (depth > 4) return;
      try {
        const res = await cloudinary.api.sub_folders(parentPath);
        for (const sf of res.folders || []) {
          const fullPath = sf.path || `${parentPath}/${sf.name}`;
          const label = `${parentLabel} / ${sf.name}`;
          folderList.push({ name: label, path: fullPath });
          await fetchSubfolders(fullPath, label, depth + 1);
        }
      } catch {
        // Leaf folder reached
      }
    }

    try {
      const rootRes = await cloudinary.api.root_folders();
      for (const f of rootRes.folders || []) {
        const fullPath = f.path || f.name;
        folderList.push({ name: f.name, path: fullPath });
        await fetchSubfolders(fullPath, f.name, 1);
      }
    } catch (fErr) {
      console.warn("Could not fetch root folders:", fErr);
    }

    return { success: true, folders: folderList };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("getCloudinaryFolders error:", msg);
    return { success: false, folders: [], error: msg };
  }
}

/**
 * Fetch Cloudinary assets with folder filter and search
 * Uses Cloudinary Search API to reliably match both asset_folder and path prefixes.
 */
export async function getCloudinaryAssets(params: {
  folder?: string;
  search?: string;
  next_cursor?: string;
  max_results?: number;
}): Promise<{
  success: boolean;
  assets: CloudinaryAsset[];
  next_cursor?: string;
  total_count?: number;
  error?: string;
}> {
  try {
    const userRes = await getCurrentUserProfile();
    if (!userRes.success || !userRes.profile) {
      return { success: false, assets: [], error: "Unauthorized access" };
    }

    const maxResults = params.max_results || 50;

    let expression = "resource_type:image";

    if (params.folder && params.folder.trim() !== "") {
      const f = params.folder.trim();
      expression += ` AND (folder:"${f}*" OR asset_folder:"${f}*")`;
    }

    if (params.search && params.search.trim() !== "") {
      const q = params.search.trim();
      expression += ` AND (filename:*${q}* OR public_id:*${q}*)`;
    }

    let searchReq = cloudinary.search
      .expression(expression)
      .sort_by("created_at", "desc")
      .max_results(maxResults);

    if (params.next_cursor) {
      searchReq = searchReq.next_cursor(params.next_cursor);
    }

    const res = await searchReq.execute();

    const resourcesList = (res.resources || []) as Array<{
      public_id: string;
      filename?: string;
      secure_url?: string;
      format?: string;
      width?: number;
      height?: number;
      bytes?: number;
      folder?: string;
      asset_folder?: string;
      created_at: string;
    }>;

    const assets: CloudinaryAsset[] = resourcesList.map((r) => {
      const parts = r.public_id.split("/");
      const filename = r.filename || parts.pop() || r.public_id;
      const folder = r.asset_folder || r.folder || parts.join("/");

      let secureUrl = r.secure_url || "";
      if (secureUrl.includes("/upload/") && !secureUrl.includes("/upload/f_auto,q_auto/")) {
        secureUrl = secureUrl.replace("/upload/", "/upload/f_auto,q_auto/");
      }

      return {
        public_id: r.public_id,
        filename,
        secure_url: secureUrl,
        format: r.format || "jpg",
        width: r.width || 0,
        height: r.height || 0,
        bytes: r.bytes || 0,
        folder,
        created_at: r.created_at,
      };
    });

    return {
      success: true,
      assets,
      next_cursor: res.next_cursor,
      total_count: res.total_count,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("getCloudinaryAssets search error:", msg);

    // Fallback to standard resources API if search API fails
    try {
      const fallbackOptions: Record<string, unknown> = {
        type: "upload",
        max_results: params.max_results || 50,
      };
      if (params.folder && params.folder.trim()) {
        fallbackOptions.prefix = params.folder.trim();
      }
      const resFallback = await cloudinary.api.resources(fallbackOptions);
      const fallbackList = (resFallback.resources || []) as Array<{
        public_id: string;
        secure_url?: string;
        format?: string;
        width?: number;
        height?: number;
        bytes?: number;
        folder?: string;
        asset_folder?: string;
        created_at: string;
      }>;
      const fallbackAssets: CloudinaryAsset[] = fallbackList.map((r) => ({
        public_id: r.public_id,
        filename: r.public_id.split("/").pop() || r.public_id,
        secure_url: (r.secure_url || "").replace("/upload/", "/upload/f_auto,q_auto/"),
        format: r.format || "jpg",
        width: r.width || 0,
        height: r.height || 0,
        bytes: r.bytes || 0,
        folder: r.asset_folder || r.folder || "",
        created_at: r.created_at,
      }));
      return { success: true, assets: fallbackAssets };
    } catch (fbErr: unknown) {
      const fbMsg = fbErr instanceof Error ? fbErr.message : String(fbErr);
      return { success: false, assets: [], error: fbMsg };
    }
  }
}
