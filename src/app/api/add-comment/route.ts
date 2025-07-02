import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { Filter } from 'bad-words';

export async function POST(req: NextRequest) {
  const { post_id, user_id, user_type, content } = await req.json();
  if (!post_id || !user_id || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  // Filter bad words
  const filter = new Filter();
  const cleanContent = filter.clean(content);
  const { data, error } = await supabase
    .from('comments')
    .insert([{ post_id, user_id, user_type, content: cleanContent }])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch the enriched comment using the helper function
  const { data: comments, error: enrichError } = await supabase.rpc('get_post_comments_with_user_info', { post_uuid: post_id });
  if (enrichError) return NextResponse.json({ error: enrichError.message }, { status: 500 });
  // Find the comment just inserted
  const enriched = (comments || []).find((c: any) => c.comment_id === data.id);
  return NextResponse.json({ comment: enriched });
} 