"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

// Configure Cloudinary Admin API
cloudinary.config({
  cloud_name: process.env.ADMIN_CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.ADMIN_CLOUDINARY_API_KEY,
  api_secret: process.env.ADMIN_CLOUDINARY_API_SECRET,
});

// Configure Backblaze S3 Client
const b2Client = new S3Client({
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

export type StorageFile = {
  name: string;
  sizeBytes: number;
};

export type StorageStats = {
  cloudinary: { 
    usedBytes: number; 
    creditsUsed: number;
    creditsLimit: number;
    percentage: number; 
    topFiles: StorageFile[];
    bandwidthUsedBytes?: number;
    bandwidthLimitBytes?: number;
    totalResources?: number;
    error?: string;
  };
  backblaze: { 
    usedBytes: number; 
    limitBytes: number;
    percentage: number;
    fileCount: number; 
    fileTypes: { type: string; size: number; count: number }[];
    topFiles: StorageFile[];
    error?: string;
  };
  supabase: { 
    usedBytes: number; 
    limitBytes: number;
    percentage: number;
    fileCount: number; 
    fileTypes: { type: string; size: number; count: number }[];
    buckets: { name: string; size: number; fileCount: number }[];
    topFiles: StorageFile[];
    error?: string;
  };
};

export async function getStorageAnalytics(): Promise<{ success: boolean; data?: StorageStats; error?: string }> {
  const role = await getRequesterRole();
  if (role !== "admin" && role !== "administrator") {
    return { success: false, error: "Unauthorized access" };
  }

  const stats: StorageStats = {
    cloudinary: { usedBytes: 0, creditsUsed: 0, creditsLimit: 0, percentage: 0, topFiles: [] },
    backblaze: { usedBytes: 0, limitBytes: 10 * 1024 * 1024 * 1024, percentage: 0, fileCount: 0, fileTypes: [], topFiles: [] }, // 10 GB limit
    supabase: { usedBytes: 0, limitBytes: 500 * 1024 * 1024, percentage: 0, fileCount: 0, fileTypes: [], buckets: [], topFiles: [] }, // 500 MB limit
  };

  // 1. Fetch Cloudinary Usage & Top Files
  try {
    const usage = await cloudinary.api.usage();
    stats.cloudinary.usedBytes = usage.storage?.usage || 0;
    
    // Some plans use credits instead of raw byte limits
    if (usage.credits) {
      stats.cloudinary.creditsUsed = usage.credits.usage;
      stats.cloudinary.creditsLimit = usage.credits.limit;
      stats.cloudinary.percentage = usage.credits.used_percent;
    }
    
    if (usage.bandwidth) {
       stats.cloudinary.bandwidthUsedBytes = usage.bandwidth.usage;
       stats.cloudinary.bandwidthLimitBytes = usage.bandwidth.limit;
    }
    
    if (usage.objects && usage.objects.usage !== undefined) {
       stats.cloudinary.totalResources = usage.objects.usage;
    } else if (usage.resources) {
       stats.cloudinary.totalResources = usage.resources.usage;
    }

    // Fetch largest files
    const resources = await cloudinary.api.resources({
      max_results: 10,
      direction: 'desc' // We can't sort by size directly without search API, so we get latest and sort manually (approximate top)
    });
    
    if (resources && resources.resources) {
      const allFiles = resources.resources.map((r: any) => ({
        name: r.public_id + "." + r.format,
        sizeBytes: r.bytes
      }));
      // Sort by size descending and take top 5
      stats.cloudinary.topFiles = allFiles.sort((a: any, b: any) => b.sizeBytes - a.sizeBytes).slice(0, 5);
    }
  } catch (error: any) {
    stats.cloudinary.error = error.message;
  }

  // 2. Fetch Backblaze B2 Usage (goals-floors-pdf)
  try {
    let continuationToken: string | undefined = undefined;
    let totalBytes = 0;
    let fileCount = 0;
    let allS3Files: StorageFile[] = [];
    const fileTypeMap = new Map<string, { size: number, count: number }>();

    do {
      const command: any = new ListObjectsV2Command({
        Bucket: "goals-floors-pdf",
        ContinuationToken: continuationToken,
      });
      const response: any = await b2Client.send(command);
      
      if (response.Contents) {
        for (const obj of response.Contents) {
          totalBytes += obj.Size || 0;
          fileCount++;
          if (obj.Key && obj.Size) {
             allS3Files.push({ name: obj.Key, sizeBytes: obj.Size });
             
             // Extract extension
             const extMatch = obj.Key.match(/\.([a-zA-Z0-9]+)$/);
             const ext = extMatch ? extMatch[1].toLowerCase() : 'other';
             const existing = fileTypeMap.get(ext) || { size: 0, count: 0 };
             fileTypeMap.set(ext, { size: existing.size + obj.Size, count: existing.count + 1 });
          }
        }
      }
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    stats.backblaze.usedBytes = totalBytes;
    stats.backblaze.percentage = (totalBytes / stats.backblaze.limitBytes) * 100;
    stats.backblaze.fileCount = fileCount;
    stats.backblaze.topFiles = allS3Files.sort((a, b) => b.sizeBytes - a.sizeBytes).slice(0, 5);
    
    stats.backblaze.fileTypes = Array.from(fileTypeMap.entries()).map(([type, data]) => ({
      type,
      size: data.size,
      count: data.count
    })).sort((a, b) => b.size - a.size);
  } catch (error: any) {
    stats.backblaze.error = error.message;
  }

  // 3. Fetch Supabase Storage Usage
  try {
    const supabase = getSupabase();
    
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) throw bucketError;
    
    let totalBytes = 0;
    let fileCount = 0;
    let allSupabaseFiles: StorageFile[] = [];
    const fileTypeMap = new Map<string, { size: number, count: number }>();
    const bucketsData: { name: string; size: number; fileCount: number }[] = [];

    if (buckets) {
      for (const bucket of buckets) {
        let bucketSize = 0;
        let bucketFileCount = 0;
        
        const { data: files } = await supabase.storage.from(bucket.name).list('', {
          limit: 1000,
        });
        
        if (files) {
          for (const file of files) {
            if (file.name !== ".emptyFolderPlaceholder" && file.metadata) {
              const size = file.metadata.size || 0;
              totalBytes += size;
              bucketSize += size;
              fileCount++;
              bucketFileCount++;
              allSupabaseFiles.push({ name: `${bucket.name}/${file.name}`, sizeBytes: size });
              
              const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/);
              const ext = extMatch ? extMatch[1].toLowerCase() : 'other';
              const existing = fileTypeMap.get(ext) || { size: 0, count: 0 };
              fileTypeMap.set(ext, { size: existing.size + size, count: existing.count + 1 });
            }
          }
        }
        
        bucketsData.push({ name: bucket.name, size: bucketSize, fileCount: bucketFileCount });
      }
    }

    stats.supabase.usedBytes = totalBytes;
    stats.supabase.percentage = (totalBytes / stats.supabase.limitBytes) * 100;
    stats.supabase.fileCount = fileCount;
    stats.supabase.topFiles = allSupabaseFiles.sort((a, b) => b.sizeBytes - a.sizeBytes).slice(0, 5);
    stats.supabase.buckets = bucketsData.sort((a, b) => b.size - a.size);
    stats.supabase.fileTypes = Array.from(fileTypeMap.entries()).map(([type, data]) => ({
      type,
      size: data.size,
      count: data.count
    })).sort((a, b) => b.size - a.size);
  } catch (error: any) {
    stats.supabase.error = error.message;
  }

  return { success: true, data: stats };
}
