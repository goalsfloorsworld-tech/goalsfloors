"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function submitBlogForReview(formData: FormData, editorContent: string) {
  // Retrieve the authenticated user's ID
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized to submit blog.");
  }

  // Extract fields from FormData
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as File | null;

  let featured_image = null;

  // If an image is provided, upload it to the `blog-images` bucket
  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Convert file to buffer for seamless upload in Node.js runtime
    const arrayBuffer = await image.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, buffer, {
        contentType: image.type,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Retrieve public URL
    const { data: publicUrlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(fileName);

    featured_image = publicUrlData.publicUrl;
  }

  // Insert the new record into the `blogs` table
  const { error: insertError } = await supabase
    .from("blogs")
    .insert([
      {
        title,
        slug,
        description,
        featured_image,
        content: editorContent,
        author_id: userId,
      },
    ]);

  if (insertError) {
    console.error("Database insert error:", insertError);
    throw new Error(`Failed to insert blog: ${insertError.message}`);
  }

  return { success: true };
}

export async function uploadEditorImage(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const file = formData.get("file") as File | null;
  console.log("Server received file:", file?.name, file?.size);

  if (!file || file.size === 0) {
    return { error: "No file provided" };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `editor-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(fileName);

    return { url: publicUrlData.publicUrl };
  } catch (err: any) {
    return { error: err.message || "Unknown error" };
  }
}