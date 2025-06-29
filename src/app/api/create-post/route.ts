import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, admin_id, org_id, image_urls, is_uni_lev } = body;

    console.log('Creating post with data:', {
      title: body.title,
      category: body.category,
      admin_id: body.admin_id,
      org_id: body.org_id,
      is_uni_lev: body.is_uni_lev,
      image_urls: body.image_urls?.length || 0
    });

    if (!title || !content || !category || !admin_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate image_urls is an array (or null/undefined)
    const sanitizedImageUrls = Array.isArray(image_urls) ? image_urls : null;

    // Create the post
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .insert({
        title,
        content,
        category,
        admin_id,
        org_id: is_uni_lev ? null : org_id, // If university level, org_id is null
        image_urls: sanitizedImageUrls, // Pass as array or null
        is_uni_lev: is_uni_lev || false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (postError) {
      console.error('Full post creation error:', {
        message: postError.message,
        details: postError.details,
        hint: postError.hint,
        code: postError.code
      });
      return NextResponse.json({ 
        error: postError.message,
        details: postError.details,
        code: postError.code
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      post 
    }, { status: 201 });

  } catch (error) {
    console.error('Error in create-post:', error);
    return NextResponse.json(
      { error: 'Failed to create post', details: String(error) },
      { status: 500 }
    );
  }
} 