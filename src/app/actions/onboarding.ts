'use server';

import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

// Admin client to bypass RLS for onboarding updates
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function getOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) return { error: 'Not authenticated' };

  try {
    let { data, error } = await supabaseAdmin
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Webhooks can arrive after the first authenticated request. Sync the user here so
        // the onboarding check works even when webhook delivery is delayed or unavailable.
        const user = await (await clerkClient()).users.getUser(userId);
        const email = user.emailAddresses.find((address) => address.id === user.primaryEmailAddressId)?.emailAddress || null;
        const syncResult = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: user.id,
            email,
            first_name: user.firstName,
            last_name: user.lastName,
            image_url: user.imageUrl,
            auth_provider: user.externalAccounts.some((account) => account.provider === 'google') ? 'Google' : 'Email',
            role: 'client',
            onboarding_completed: false,
          }, { onConflict: 'id' })
          .select('onboarding_completed')
          .single();

        data = syncResult.data;
        error = syncResult.error;
      }
      if (error) throw error;
    }

    if (!data) throw new Error('Profile data was not returned');
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

  // Validate phone number (exactly 10 digits)
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(data.phone_number)) {
    return { error: 'Phone number must be exactly 10 digits' };
  }

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
  } catch (error: unknown) {
    console.error('Exception during onboarding:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { error: `Server error: ${message}` };
  }
}
