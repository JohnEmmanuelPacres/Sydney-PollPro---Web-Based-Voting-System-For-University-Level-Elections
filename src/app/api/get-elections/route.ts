import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const { orgID } = await request.json();

  if (!orgID) {
    return NextResponse.json({ error: 'Missing orgID' }, { status: 400 });
  }

  // Fetch elections for the given orgID
  const { data: elections, error: electionsError } = await supabaseAdmin
    .from('elections')
    .select('*')
    .eq('org_id', orgID)
    .order('start_date', { ascending: false });

  if (electionsError) {
    return NextResponse.json({ error: electionsError.message }, { status: 500 });
  }

  // For each election, fetch positions and candidates
  const detailedElections = await Promise.all(
    (elections || []).map(async (election) => {
      // Fetch positions for this election
      const { data: positions, error: positionsError } = await supabaseAdmin
        .from('positions')
        .select('*')
        .eq('election_id', election.id);
      if (positionsError) {
        return { ...election, positions: [], candidates: [], error: positionsError.message };
      }

      // Fetch candidates for this election
      const { data: candidates, error: candidatesError } = await supabaseAdmin
        .from('candidates')
        .select('*')
        .eq('election_id', election.id);
      if (candidatesError) {
        return { ...election, positions, candidates: [], error: candidatesError.message };
      }

      return {
        ...election,
        positions,
        candidates,
      };
    })
  );

  return NextResponse.json({ elections: detailedElections }, { status: 200 });
} 