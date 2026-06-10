"use server";

import { supabaseAdmin } from "@/lib/supabase";

export async function getTrendingComparisons(limit: number = 10) {
  try {
    const { data, error } = await supabaseAdmin
      .from('product_comparisons')
      .select('slug, product_a, product_b, category')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error("Error fetching trending comparisons:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Exception fetching trending comparisons:", err);
    return [];
  }
}
