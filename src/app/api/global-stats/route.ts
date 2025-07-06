import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let electionId = searchParams.get('electionId');

  // Always fetch total registered voters
  const { count: voters } = await supabaseAdmin
    .from('voter_profiles')
    .select('*', { count: 'exact', head: true });

  let uniqueVoters = 0;
  let totalVotes = 0;

  // If no electionId, find the latest university-level election (ongoing or upcoming)
  if (!electionId) {
    const now = new Date().toISOString();
    const { data: elections, error: electionsError } = await supabaseAdmin
      .from('elections')
      .select('id, start_date')
      .eq('is_uni_level', true)
      .gte('end_date', now)
      .order('start_date', { ascending: true });
    if (elections && elections.length > 0) {
      electionId = elections[0].id;
    }
  }

  if (electionId) {
    const { data: votesData } = await supabaseAdmin
      .from('votes')
      .select('user_id, election_id')
      .eq('election_id', electionId);
    if (votesData) {
      uniqueVoters = new Set(votesData.map(v => v.user_id)).size;
      totalVotes = votesData.length;
    }
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