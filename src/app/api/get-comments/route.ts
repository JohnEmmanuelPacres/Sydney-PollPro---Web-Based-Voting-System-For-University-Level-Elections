import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const post_id = searchParams.get('post_id');
  if (!post_id) return NextResponse.json({ error: 'Missing post_id' }, { status: 400 });

  // Fetch comments with user info using the new function
  const { data: comments, error: commentsError } = await supabase.rpc('get_post_comments_with_user_info', { post_uuid: post_id });
  if (commentsError) return NextResponse.json({ error: commentsError.message }, { status: 500 });

  // For each comment, fetch replies with user info
  const commentsWithReplies = await Promise.all((comments || []).map(async (comment: any) => {
    const { data: replies, error: repliesError } = await supabase.rpc('get_comment_replies_with_user_info', { comment_uuid: comment.comment_id });
    return {
      ...comment,
      replies: (replies || []).map((reply: any) => ({
        ...reply,
        user_name: reply.display_name,
        avatar_initial: reply.avatar_initial,
      })),
      user_name: comment.display_name,
      avatar_initial: comment.avatar_initial,
    };
  }));

  return NextResponse.json({ comments: commentsWithReplies });
} 