"use server";

import { createClient } from "@supabase/supabase-js";
import { CatalogData } from "./admin-catalogs";

export async function getPublicCatalogs(): Promise<CatalogData[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("page_catalogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching public catalogs:", error);
      return [];
    }
    
    return data as CatalogData[];
  } catch (error) {
    console.error("Error fetching public catalogs:", error);
    return [];
  }
}
