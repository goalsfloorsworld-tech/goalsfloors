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
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name: data.full_name,
        phone_number: data.phone_number,
        role: data.role,
        referral_source: data.referral_source,
        onboarding_completed: true,
      })
      .eq('id', userId);

    if (error) throw error;

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return { error: 'Failed to save details' };
  }
}
