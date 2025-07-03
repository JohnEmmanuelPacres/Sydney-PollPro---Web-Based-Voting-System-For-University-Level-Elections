import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { Filter } from 'bad-words';

export async function POST(req: NextRequest) {
  const { reply_id, user_id, user_type, content } = await req.json();
  
  if (!reply_id || !user_id || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    // First, verify the user owns this reply
    const { data: existingReply, error: fetchError } = await supabase
      .from('replies')
      .select('user_id, user_type')
      .eq('id', reply_id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }

    if (existingReply.user_id !== user_id) {
      return NextResponse.json({ error: 'Unauthorized to edit this reply' }, { status: 403 });
    }

    // Filter bad words
    const filter = new Filter();
    const cleanContent = filter.clean(content);

    // Update the reply
    const { data, error } = await supabase
      .from('replies')
      .update({ content: cleanContent, updated_at: new Date().toISOString() })
      .eq('id', reply_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, reply: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update reply' }, { status: 500 });
  }
} 