'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

interface CreateDealerData {
  clerk_user_id?: string;
  slug: string;
  business_name: string;
  phone: string;
  whatsapp_number?: string | null;
  city?: string | null;
  area?: string | null;
  pincode?: string | null;
  is_approved?: boolean;
  profile_complete?: boolean;
}

export async function checkSlugAvailability(slug: string) {
  try {
    const { data: existingDealer, error } = await supabaseAdmin
      .from('dealers')
      .select('id')
      .eq('slug', slug)
      .single();
      
    if (error && error.code === 'PGRST116') {
      return { available: true };
    }
    
    if (existingDealer) {
      return { available: false };
    }
    
    throw error;
  } catch (err: any) {
    console.error('Error checking slug:', err);
    return { error: 'Failed to check slug availability' };
  }
}

export async function createDealerProfile(data: CreateDealerData) {
  try {
    // If clerk_user_id is not provided, fetch it securely on the server
    const { userId } = await auth();
    const clerkId = data.clerk_user_id || userId;

    if (!clerkId) {
      return { error: 'Not authenticated' };
    }

    let currentSlug = data.slug;

    // Check if slug exists
    const { data: existingDealer, error: checkError } = await supabaseAdmin
      .from('dealers')
      .select('id')
      .eq('slug', currentSlug)
      .single();
      
    if (existingDealer) {
      return { error: 'Is slug ka ek dealer pehle se hai, kripya dusra naam chunein.' };
    } else if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    // Insert the new dealer
    const { error: insertError } = await supabaseAdmin
      .from('dealers')
      .insert({
        clerk_user_id: clerkId,
        slug: currentSlug,
        business_name: data.business_name,
        phone: data.phone,
        whatsapp_number: data.whatsapp_number || null,
        city: data.city || null,
        area: data.area || null,
        pincode: data.pincode || null,
        is_approved: data.is_approved || false,
        profile_complete: data.profile_complete || false,
      });

    if (insertError) {
      // If it's a unique constraint violation on clerk_user_id, they already have a profile
      if (insertError.code === '23505') {
          return { error: 'A dealer profile already exists for this user.' };
      }
      throw insertError;
    }

    // Fetch current profile to check role
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', clerkId)
      .single();

    // If not admin/staff, upgrade their role to dealer
    if (profile && !['admin', 'administrator', 'team'].includes(profile.role)) {
      await supabaseAdmin
        .from('profiles')
        .update({ role: 'dealer' })
        .eq('id', clerkId);
    }

    return { success: true, slug: currentSlug };
  } catch (error: any) {
    console.error('Error creating dealer profile:', error);
    return { error: error.message || 'Failed to create dealer profile' };
  }
}
