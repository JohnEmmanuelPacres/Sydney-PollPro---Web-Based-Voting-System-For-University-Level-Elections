import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const candidateId = searchParams.get('candidate_id');
  const electionId = searchParams.get('election_id');

  if (!candidateId || !electionId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const { count, error } = await supabaseAdmin
    .from('votes')
    .select('id', { count: 'exact', head: true })
    .eq('candidate_id', candidateId)
    .eq('election_id', electionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count });
}