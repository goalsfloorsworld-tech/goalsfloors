"use server";

import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Helper to get the dedicated Finance Supabase client
function getFinanceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_FINANCE_SUPABASE_URL!,
    process.env.FINANCE_SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Server Action to check if a Master PIN is already set.
 */
export async function checkMasterFinancePinExists() {
  try {
    const supabase = getFinanceSupabase();
    
    const { data, error } = await supabase
      .from('portal_access_keys')
      .select('id')
      .eq('is_active', true)
      .limit(1);
      
    if (error) {
      return { success: false, error: 'Failed to check PIN status.' };
    }
    
    return { success: true, exists: data && data.length > 0 };
  } catch (error: any) {
    console.error("checkMasterFinancePinExists error:", error);
    return { success: false, error: 'Internal server error' };
  }
}

/**
 * Server Action to set or update the Universal Master PIN for the Finance Portal.
 */
export async function setMasterFinancePin(newPin: string, adminEmail: string) {
  try {
    if (!newPin || newPin.length < 4) {
      return { success: false, error: 'PIN must be at least 4 characters long' };
    }

    const supabase = getFinanceSupabase();
    
    // Hash the incoming PIN using SHA-256 for secure storage
    const pinHash = crypto.createHash('sha256').update(newPin).digest('hex');
    const updatedAt = new Date().toISOString();

    // Try to update the existing active row
    const { data: updateData, error: updateError } = await supabase
      .from('portal_access_keys')
      .update({ 
        pin_hash: pinHash, 
        updated_by: adminEmail, 
        updated_at: updatedAt 
      })
      .eq('is_active', true)
      .select();

    if (updateError) {
      return { success: false, error: 'Database error while updating PIN.' };
    }

    // If no rows were updated, it means the table is empty or has no active keys. We must INSERT.
    if (!updateData || updateData.length === 0) {
      const { error: insertError } = await supabase
        .from('portal_access_keys')
        .insert([{
          pin_hash: pinHash,
          is_active: true,
          updated_by: adminEmail,
          updated_at: updatedAt
        }]);

      if (insertError) {
        return { success: false, error: 'Database error while inserting PIN.' };
      }
    }

    return { success: true };

  } catch (error: any) {
    console.error("setMasterFinancePin error:", error);
    return { success: false, error: 'Internal server error' };
  }
}
