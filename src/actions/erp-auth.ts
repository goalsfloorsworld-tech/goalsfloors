'use server';

import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import { getCurrentUserProfile } from './admin-core';

// Initialize Supabase Admin Client using the Service Role Key
const getAdminSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_FINANCE_SUPABASE_URL || process.env.FINANCE_SUPABASE_URL;
  const serviceRoleKey = process.env.FINANCE_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Finance Database environment variables are missing.');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

/**
 * Ensures the caller is a highly privileged admin on the Main Site
 */
const requireMasterAdmin = async () => {
  const authState = await auth();
  const claims = authState.sessionClaims as any;
  const clerkRole = claims?.publicMetadata?.role || claims?.metadata?.role || claims?.role;

  const res = await getCurrentUserProfile();
  const dbRole = res.success ? res.profile?.role : null;
  const role = clerkRole || dbRole;

  if (role !== 'administrator' && role !== 'admin' && role !== 'superadmin') {
    throw new Error('Unauthorized: Master Admin clearance required.');
  }
};

export async function createErpUser(formData: FormData) {
  try {
    await requireMasterAdmin();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    if (!email || !password || !role) {
      return { success: false, error: 'Email, password, and role are required.' };
    }

    if (role !== 'ADMIN' && role !== 'ACCOUNTANT') {
      return { success: false, error: 'Invalid role selected.' };
    }

    // ─── Verify user exists in Main DB (goalsfloors.com) ───
    const mainDb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: profile } = await mainDb
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single();

    if (!profile) {
      return { 
        success: false, 
        error: `The email ${email} is not registered on goalsfloors.com. The user must sign in there first before an ERP account can be provisioned.` 
      };
    }

    const supabase = getAdminSupabase();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: role,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: 'ERP user created successfully.' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create ERP user.' };
  }
}

export async function verifyMainSiteEmail(email: string) {
  try {
    await requireMasterAdmin();
    
    if (!email || !email.includes('@')) {
      return { success: false, exists: false };
    }

    const mainDb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: profile } = await mainDb
      .from('profiles')
      .select('email')
      .eq('email', email.trim())
      .single();

    return { success: true, exists: !!profile };
  } catch (error) {
    return { success: false, exists: false };
  }
}

export async function listErpUsers() {
  try {
    await requireMasterAdmin();

    const supabase = getAdminSupabase();
    
    // We list up to 50 users for simplicity
    const { data: users, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 50,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Map necessary fields so we don't send massive auth objects to client
    const mappedUsers = users.users.map(u => ({
      id: u.id,
      email: u.email,
      role: u.user_metadata?.role || 'UNKNOWN',
      last_sign_in_at: u.last_sign_in_at,
      created_at: u.created_at,
    }));

    return { success: true, users: mappedUsers };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch ERP users.' };
  }
}

export async function deleteErpUser(userId: string) {
  try {
    await requireMasterAdmin();

    if (!userId) {
      return { success: false, error: 'User ID is required.' };
    }

    const supabase = getAdminSupabase();
    
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: 'ERP user deleted successfully.' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete ERP user.' };
  }
}

export async function forceResetErpUserPassword(userId: string, newPassword: string) {
  try {
    await requireMasterAdmin();

    if (!userId || !newPassword) {
      return { success: false, error: 'User ID and new password are required.' };
    }

    const supabase = getAdminSupabase();
    
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: 'ERP password reset successfully.' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to reset ERP password.' };
  }
}
