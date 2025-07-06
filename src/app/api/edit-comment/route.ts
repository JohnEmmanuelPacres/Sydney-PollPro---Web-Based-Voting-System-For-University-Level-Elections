import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { Filter } from 'bad-words';

export async function POST(req: NextRequest) {
  const { comment_id, user_id, user_type, content } = await req.json();
  
  if (!comment_id || !user_id || !content) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    // First, verify the user owns this comment
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('user_id, user_type')
      .eq('id', comment_id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    if (existingComment.user_id !== user_id) {
      return NextResponse.json({ error: 'Unauthorized to edit this comment' }, { status: 403 });
    }

    // Filter bad words
    const filter = new Filter();
    const cleanContent = filter.clean(content);

    // Update the comment
    const { data, error } = await supabase
      .from('comments')
      .update({ content: cleanContent, updated_at: new Date().toISOString() })
      .eq('id', comment_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, comment: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update comment' }, { status: 500 });
  }
} 