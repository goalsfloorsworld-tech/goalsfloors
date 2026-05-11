'use server';

import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client to bypass RLS for onboarding updates
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function getOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) return { error: 'Not authenticated' };

  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist yet (webhook might be slow)
        return { needsOnboarding: null, retry: true };
      }
      throw error;
    }

    return { needsOnboarding: !data.onboarding_completed };
  } catch (error) {
    console.error('Error fetching onboarding status:', error);
    return { error: 'Failed to fetch status' };
  }
}

export async function completeOnboarding(data: {
  full_name: string;
  phone_number: string;
  role: string;
  referral_source: string;
}) {
  const { userId } = await auth();
  if (!userId) return { error: 'Not authenticated' };

  try {
    // Use upsert to handle cases where the webhook might not have finished creating the profile
    const { error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        full_name: data.full_name,
        phone_number: data.phone_number,
        role: data.role.toLowerCase(), // Save as lowercase for DB constraint
        referral_source: data.referral_source,
        onboarding_completed: true,
      }, { onConflict: 'id' });

    if (error) {
      console.error('Supabase error during onboarding:', error);
      return { error: `Database error: ${error.message}` };
    }

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Exception during onboarding:', error);
    return { error: `Server error: ${error.message || 'Unknown error'}` };
  }
}
