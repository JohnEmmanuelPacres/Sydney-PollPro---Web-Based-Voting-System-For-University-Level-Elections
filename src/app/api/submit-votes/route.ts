import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { votes, electionId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId in request body' }, { status: 400 });
    }

    // Check if user has already voted in this election
    const { data: existingVotes, error: checkError } = await supabaseAdmin
      .from('votes')
      .select('id')
      .eq('user_id', userId)
      .eq('election_id', electionId);

    if (checkError) {
      console.error('Error checking existing votes:', checkError);
      return NextResponse.json({ error: checkError.message || 'Failed to check existing votes' }, { status: 500 });
    }

    if (existingVotes && existingVotes.length > 0) {
      return NextResponse.json({ error: 'You have already voted in this election' }, { status: 400 });
    }

    // Prepare votes data for insertion
    const votesToInsert = Object.entries(votes).map(([positionId, candidateId]) => ({
      user_id: userId,
      election_id: electionId,
      position_id: positionId,
      candidate_id: candidateId as string,
    }));

    // Insert votes
    const { data: insertedVotes, error: insertError } = await supabaseAdmin
      .from('votes')
      .insert(votesToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting votes:', insertError);
      return NextResponse.json({ error: insertError.message || 'Failed to submit votes' }, { status: 500 });
    }

    // Update voter_profiles to mark as voted
    const { error: updateError } = await supabaseAdmin
      .from('voter_profiles')
      .update({ isvoted: true })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating voter profile:', updateError);
      // Optionally, you can also return this error if you want
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Votes submitted successfully',
      votesSubmitted: insertedVotes 
    });

  } catch (error) {
    console.error('Error in submit-votes API:', error);
    let errorMessage = 'Internal server error';
    if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = (error as any).message;
    } else {
      errorMessage = JSON.stringify(error);
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 