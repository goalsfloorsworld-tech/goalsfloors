import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  // 1. Validate Clerk Webhook Secret
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // 2. Validate Supabase Credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return new Response('Missing Supabase credentials in environment', { status: 500 });
  }

  // Create a Supabase admin client to bypass RLS when performing background sync
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // 3. Get the svix headers for verification
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  // 4. Get the body as string to pass to Svix
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // 5. Create a new Svix instance with your secret and verify
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred during verification', { status: 400 });
  }

  // 6. Handle the specific events
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url, external_accounts } = evt.data as any;
    
    // Determine the Auth Provider
    let auth_provider = 'Email';
    if (external_accounts && Array.isArray(external_accounts) && external_accounts.length > 0) {
      if (external_accounts[0].provider === 'oauth_google') {
        auth_provider = 'Google';
      }
    }

    // Safely extract the primary email address
    const email = email_addresses && email_addresses.length > 0 
      ? email_addresses[0].email_address 
      : null;

    try {
      // Upsert the data into the Supabase profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id,                     // Matches Clerk User ID
          email,
          first_name,
          last_name,
          image_url,
          auth_provider,          // Track Google vs Email signup
          role: 'user',           // Default value constraint
        }, { onConflict: 'id' });

      if (error) throw error;
      
      console.log(`Successfully synced user ${id} to Supabase profiles.`);
    } catch (error) {
      console.error(`Error syncing user ${id} to Supabase:`, error);
      return new Response('Error syncing user to Supabase', { status: 500 });
    }
  }

  return new Response('Webhook processed successfully', { status: 200 });
}
