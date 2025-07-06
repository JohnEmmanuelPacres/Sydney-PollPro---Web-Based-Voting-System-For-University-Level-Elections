import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const electionId = searchParams.get('electionId');

    if (!electionId) {
      return NextResponse.json({ error: 'Election ID is required' }, { status: 400 });
    }

    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized - No valid session' }, { status: 401 });
    }

    const userId = session.user.id;

    // Check if user has voted in this election
    const { data: existingVotes, error: checkError } = await supabase
      .from('votes')
      .select('id, position_id, candidate_id')
      .eq('user_id', userId)
      .eq('election_id', electionId);

    if (checkError) {
      console.error('Error checking vote status:', checkError);
      return NextResponse.json({ error: 'Failed to check vote status' }, { status: 500 });
    }

    const hasVoted = existingVotes && existingVotes.length > 0;

    return NextResponse.json({ 
      hasVoted,
      votes: existingVotes || [],
      voteCount: existingVotes ? existingVotes.length : 0
    });

  } catch (error) {
    console.error('Error in check-vote-status API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 