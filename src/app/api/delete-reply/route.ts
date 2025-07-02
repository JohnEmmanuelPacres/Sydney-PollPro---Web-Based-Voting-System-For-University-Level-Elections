import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const { reply_id } = await req.json();
    
    if (!reply_id) {
      return NextResponse.json({ error: 'Missing reply_id' }, { status: 400 });
    }

    // Delete the reply from the database
    const { error } = await supabase
      .from('replies')
      .delete()
      .eq('id', reply_id);

    if (error) {
      console.error('Error deleting reply:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Reply deleted successfully' });
  } catch (error) {
    console.error('Error in delete-reply API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 