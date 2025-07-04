import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const electionId = searchParams.get('electionId');

  if (!electionId) {
    return NextResponse.json({
      voters: 0,
      votes: 0,
      participation: 0,
      error: 'Missing electionId parameter.'
    }, { status: 400 });
  }

  // Fetch total registered voters eligible for this election
  // (Assume all voters are eligible unless you have eligibility logic)
  const { count: voters } = await supabaseAdmin
    .from('voter_profiles')
    .select('*', { count: 'exact', head: true });

  // Fetch all user_id values from votes for this election and count unique ones
  let uniqueVoters = 0;
  let totalVotes = 0;
  const { data: votesData } = await supabaseAdmin
    .from('votes')
    .select('user_id, election_id')
    .eq('election_id', electionId);
  if (votesData) {
    uniqueVoters = new Set(votesData.map(v => v.user_id)).size;
    totalVotes = votesData.length;
  }

  const safeVoters = voters ?? 0;
  const safeVotes = uniqueVoters;

  return NextResponse.json({
    voters: safeVoters,
    votes: safeVotes,
    participation: safeVoters > 0 ? Math.round((safeVotes / safeVoters) * 100) : 0,
    totalVotes: totalVotes
  });
} 