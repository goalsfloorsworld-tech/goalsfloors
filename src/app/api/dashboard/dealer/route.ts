import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: dealer, error } = await supabaseAdmin
      .from('dealers')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    if (error || !dealer) {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
    }

    return NextResponse.json(dealer);
  } catch (error) {
    console.error('Error fetching dealer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    const {
      business_name,
      tagline,
      description,
      phone,
      whatsapp_number,
      city,
      area,
      pincode,
      products,
      profile_complete
    } = body;

    const { error } = await supabaseAdmin
      .from('dealers')
      .update({
        business_name,
        tagline,
        description,
        phone,
        whatsapp_number,
        city,
        area,
        pincode,
        products,
        profile_complete,
        updated_at: new Date().toISOString()
      })
      .eq('clerk_user_id', userId);

    if (error) {
      return NextResponse.json({ error: 'Failed to update dealer' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating dealer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
