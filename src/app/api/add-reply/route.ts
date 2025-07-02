import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { Filter } from 'bad-words';

export async function POST(req: NextRequest) {
  const { comment_id, user_id, user_type, content } = await req.json();
  if (!comment_id || !user_id || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  // Filter bad words
  const filter = new Filter();
  const cleanContent = filter.clean(content);
  const { data, error } = await supabase
    .from('replies')
    .insert([{ comment_id, user_id, user_type, content: cleanContent }])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch the enriched reply using the helper function
  const { data: replies, error: enrichError } = await supabase.rpc('get_comment_replies_with_user_info', { comment_uuid: comment_id });
  if (enrichError) return NextResponse.json({ error: enrichError.message }, { status: 500 });
  // Find the reply just inserted
  const enriched = (replies || []).find((r: any) => r.reply_id === data.id);
  return NextResponse.json({ reply: enriched });
} 