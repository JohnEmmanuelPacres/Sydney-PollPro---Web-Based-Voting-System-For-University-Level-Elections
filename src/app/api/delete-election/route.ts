import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { electionId } = await request.json();

    if (!electionId) {
      return NextResponse.json({ error: 'Missing electionId' }, { status: 400 });
    }

    console.log('Deleting election:', electionId);

    // First, check if the election exists
    const { data: election, error: electionCheckError } = await supabaseAdmin
      .from('elections')
      .select('id, name')
      .eq('id', electionId)
      .single();

    if (electionCheckError || !election) {
      return NextResponse.json({ error: 'Election not found' }, { status: 404 });
    }

    // Delete in the correct order to maintain referential integrity
    // 1. Delete votes (if votes table exists)
    const { error: votesDeleteError } = await supabaseAdmin
      .from('votes')
      .delete()
      .eq('election_id', electionId);

    if (votesDeleteError) {
      console.error('Error deleting votes:', votesDeleteError);
      // Continue even if votes deletion fails (votes table might not exist)
    }

    // 2. Delete candidates
    const { error: candidatesDeleteError } = await supabaseAdmin
      .from('candidates')
      .delete()
      .eq('election_id', electionId);

    if (candidatesDeleteError) {
      console.error('Error deleting candidates:', candidatesDeleteError);
      return NextResponse.json({ error: 'Failed to delete candidates: ' + candidatesDeleteError.message }, { status: 500 });
    }

    // 3. Delete positions
    const { error: positionsDeleteError } = await supabaseAdmin
      .from('positions')
      .delete()
      .eq('election_id', electionId);

    if (positionsDeleteError) {
      console.error('Error deleting positions:', positionsDeleteError);
      return NextResponse.json({ error: 'Failed to delete positions: ' + positionsDeleteError.message }, { status: 500 });
    }

    // 4. Finally, delete the election itself
    const { error: electionDeleteError } = await supabaseAdmin
      .from('elections')
      .delete()
      .eq('id', electionId);

    if (electionDeleteError) {
      console.error('Error deleting election:', electionDeleteError);
      return NextResponse.json({ error: 'Failed to delete election: ' + electionDeleteError.message }, { status: 500 });
    }

    console.log('Election deleted successfully:', election.name);

    return NextResponse.json({ 
      success: true,
      message: `Election "${election.name}" has been permanently deleted`
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error deleting election:', error);
    return NextResponse.json({ 
      error: 'Unexpected error deleting election' 
    }, { status: 500 });
  }
} 