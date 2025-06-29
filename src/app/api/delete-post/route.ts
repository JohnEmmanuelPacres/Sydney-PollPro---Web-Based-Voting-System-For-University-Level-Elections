import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });
    }

    // 1. Fetch the post to get image URLs
    const { data: post, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('image_urls')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // 2. Delete images from storage if any
    if (post?.image_urls && Array.isArray(post.image_urls)) {
      for (const url of post.image_urls) {
        // Extract the path after the bucket name
        // Example: https://<project>.supabase.co/storage/v1/object/public/article-images/filename.jpg
        const match = url.match(/article-images\/(.+)$/);
        if (match && match[1]) {
          await supabaseAdmin.storage.from('article-images').remove([match[1]]);
        }
      }
    }

    // 3. Delete the post from the table
    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post', details: String(error) }, { status: 500 });
  }
} 