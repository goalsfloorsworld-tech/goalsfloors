import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dealer_id, name, phone, message } = body;

    // Validation
    if (!dealer_id || !name || !phone) {
      return NextResponse.json({ error: 'Dealer ID, Name, and Phone are required' }, { status: 400 });
    }

    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: 'Phone must be 10 digits' }, { status: 400 });
    }

    // Fetch Dealer
    const { data: dealer, error: dealerError } = await supabaseAdmin
      .from('dealers')
      .select('id, slug, business_name, whatsapp_number, phone, city')
      .eq('id', dealer_id)
      .eq('is_approved', true)
      .single();

    if (dealerError || !dealer) {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
    }

    // Dual Save 1: Supabase
    const { error: insertError } = await supabaseAdmin
      .from('leads')
      .insert({
        dealer_id: dealer.id,
        dealer_slug: dealer.slug,
        customer_name: name,
        customer_phone: phone,
        customer_message: message || null
      });

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }

    // Dual Save 2: Google Sheets
    if (process.env.GOOGLE_SCRIPT_URL) {
      try {
        await fetch(process.env.GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            phone: phone,
            message: message || '',
            dealer_name: dealer.business_name,
            dealer_slug: dealer.slug,
            dealer_city: dealer.city,
            interest: 'Dealer Lead',
            source: 'dealer_public_page'
          })
        });
      } catch (sheetError) {
        console.error('Google Sheet save failed:', sheetError);
        // Do not fail the request
      }
    }

    // Send email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        await resend.emails.send({
          from: 'Goals Floors Leads <onboarding@resend.dev>',
          to: 'goalsfloors.world@gmail.com',
          subject: `New Lead for ${dealer.business_name} — Goals Floors`,
          html: `
            <p>New lead received on dealer page:</p>
            <ul>
              <li><strong>Dealer:</strong> ${dealer.business_name} (${dealer.slug})</li>
              <li><strong>Customer:</strong> ${name}</li>
              <li><strong>Phone:</strong> ${phone}</li>
              <li><strong>Message:</strong> ${message || 'No message'}</li>
            </ul>
          `
        });
      } catch (emailError) {
        console.error('Resend email failed:', emailError);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
