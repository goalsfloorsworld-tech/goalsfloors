'use server';

import { v2 as cloudinary } from 'cloudinary';

// Note: Ensure ADMIN_CLOUDINARY_CLOUD_NAME (dcezlxt8r), ADMIN_CLOUDINARY_API_KEY, and ADMIN_CLOUDINARY_API_SECRET are in your .env.local
cloudinary.config({
  cloud_name: process.env.ADMIN_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.ADMIN_CLOUDINARY_API_KEY,
  api_secret: process.env.ADMIN_CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(formData: FormData, folderName: string): Promise<{ success: boolean; secure_url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File | null;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const originalFileName = file.name;
    const nameWithoutExt = originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName;
    const sanitizedFileName = nameWithoutExt.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const expectedPublicId = `goalsfloors/uploads/${folderName}/${sanitizedFileName}`;

    try {
      await cloudinary.api.resource(expectedPublicId);
      // If it doesn't throw, it means the file exists
      return { success: false, error: `An image named "${originalFileName}" already exists in this folder. Please rename your file.` };
    } catch (error: any) {
      // A 404 error means it doesn't exist, which is what we want. 
      // If it's a different error, we proceed anyway as upload_stream will catch actual auth/network issues.
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `goalsfloors/uploads/${folderName}`,
          public_id: sanitizedFileName,
        },
        (error, result) => {
          if (error || !result) {
            console.error("Cloudinary Upload Error:", error);
            resolve({ success: false, error: error?.message || 'Failed to upload image' });
          } else {
            resolve({ success: true, secure_url: result.secure_url });
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error: any) {
    console.error("Error processing file upload:", error);
    return { success: false, error: error.message || "Server error during upload" };
  }
}

export async function deleteImageFromCloudinary(imageUrl: string): Promise<boolean> {
  if (!imageUrl || !imageUrl.includes('res.cloudinary.com') || !imageUrl.includes('goalsfloors/uploads/')) {
    return true; // Not a managed cloudinary image or empty, nothing to delete
  }
  try {
    const parts = imageUrl.split('/upload/');
    if (parts.length === 2) {
      const pathWithVersion = parts[1];
      // Remove the version tag if it exists (e.g. v1234567890/)
      let pathWithoutVersion = pathWithVersion.replace(/^v\d+\//, '');
      // Remove the file extension
      const lastDotIndex = pathWithoutVersion.lastIndexOf('.');
      const publicId = lastDotIndex !== -1 ? pathWithoutVersion.substring(0, lastDotIndex) : pathWithoutVersion;
      
      await cloudinary.uploader.destroy(publicId);
      return true;
    }
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
  }
  return false;
}

export async function checkCloudinaryFileExists(fileName: string, folderName: string): Promise<{ exists: boolean }> {
  try {
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    const sanitizedFileName = nameWithoutExt.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const expectedPublicId = `goalsfloors/uploads/${folderName}/${sanitizedFileName}`;
    
    await cloudinary.api.resource(expectedPublicId);
    return { exists: true };
  } catch (error) {
    return { exists: false };
  }
}
