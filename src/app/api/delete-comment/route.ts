import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const { comment_id } = await req.json();
    if (!comment_id) {
      return NextResponse.json({ error: 'Missing comment_id' }, { status: 400 });
    }

    // Delete all replies for this comment (defensive, even with ON DELETE CASCADE)
    await supabase.from('replies').delete().eq('comment_id', comment_id);

    // Delete the comment itself
    const { error } = await supabase.from('comments').delete().eq('id', comment_id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 