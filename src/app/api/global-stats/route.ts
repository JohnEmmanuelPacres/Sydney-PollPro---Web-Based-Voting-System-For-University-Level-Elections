import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // Get all university-level election IDs
  const { data: uniElections } = await supabaseAdmin
    .from('elections')
    .select('id')
    .eq('is_uni_level', true);

  const uniElectionIds = uniElections ? uniElections.map(e => e.id) : [];

  // Fetch total registered voters (all voters)
  const { count: voters } = await supabaseAdmin
    .from('voter_profiles')
    .select('*', { count: 'exact', head: true });

  // Fetch all user_id values from votes for university-level elections and count unique ones
  let uniqueVoters = 0;
  if (uniElectionIds.length > 0) {
    const { data: votesData } = await supabaseAdmin
      .from('votes')
      .select('user_id, election_id');
    const filteredVotes = votesData ? votesData.filter(v => uniElectionIds.includes(v.election_id)) : [];
    uniqueVoters = new Set(filteredVotes.map(v => v.user_id)).size;
  }

  const safeVoters = voters ?? 0;
  const safeVotes = uniqueVoters;

  return NextResponse.json({
    voters: safeVoters,
    votes: safeVotes,
    participation: safeVoters > 0 ? Math.round((safeVotes / safeVoters) * 100) : 0,
  });
} 