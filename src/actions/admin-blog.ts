"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getPendingBlogs() {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending blogs:", error);
    throw new Error("Failed to fetch pending blogs.");
  }

  return data || [];
}

export async function approveBlog(id: string) {
  const { error } = await supabase
    .from("blogs")
    .update({ is_published: true })
    .eq("id", id);

  if (error) {
    console.error("Error approving blog:", error);
    throw new Error("Failed to approve blog.");
  }

  revalidatePath("/blogs");
  revalidatePath("/admin/blogs");
  
  return { success: true };
}

export async function rejectBlog(id: string) {
  const { error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error rejecting blog:", error);
    throw new Error("Failed to reject blog.");
  }

  revalidatePath("/blogs");
  revalidatePath("/admin/blogs");
  
  return { success: true };
}
