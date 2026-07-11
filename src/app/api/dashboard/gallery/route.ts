import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: dealer, error: dealerError } = await supabaseAdmin
      .from('dealers')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (dealerError || !dealer) {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
    }

    const { data: images, error: imagesError } = await supabaseAdmin
      .from('project_images')
      .select('*')
      .eq('dealer_id', dealer.id)
      .order('created_at', { ascending: true });

    if (imagesError) {
      return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
    }

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error in GET /api/dashboard/gallery:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: dealer, error: dealerError } = await supabaseAdmin
      .from('dealers')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (dealerError || !dealer) {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
    }

    // Check count of existing images
    const { count, error: countError } = await supabaseAdmin
      .from('project_images')
      .select('*', { count: 'exact', head: true })
      .eq('dealer_id', dealer.id);

    if (countError) {
      return NextResponse.json({ error: 'Failed to verify image count' }, { status: 500 });
    }

    if (count !== null && count >= 10) {
      return NextResponse.json({ error: 'Maximum 10 photos allowed' }, { status: 400 });
    }

    const body = await req.json();
    const { image_url, caption } = body;

    if (!image_url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const { data: newRow, error: insertError } = await supabaseAdmin
      .from('project_images')
      .insert({
        dealer_id: dealer.id,
        image_url,
        caption
      })
      .select()
      .single();

    if (insertError || !newRow) {
      return NextResponse.json({ error: 'Failed to save image' }, { status: 500 });
    }

    return NextResponse.json({ success: true, image: newRow });
  } catch (error) {
    console.error('Error in POST /api/dashboard/gallery:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: dealer, error: dealerError } = await supabaseAdmin
      .from('dealers')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (dealerError || !dealer) {
      return NextResponse.json({ error: 'Dealer not found' }, { status: 404 });
    }

    const body = await req.json();
    const { image_id } = body;

    if (!image_id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    const { error: deleteError } = await supabaseAdmin
      .from('project_images')
      .delete()
      .eq('id', image_id)
      .eq('dealer_id', dealer.id);

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/dashboard/gallery:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
