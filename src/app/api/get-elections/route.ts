import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { orgID } = await request.json();

    if (!orgID) {
      return NextResponse.json({ error: 'Missing orgID' }, { status: 400 });
    }

    // Fetch elections with related positions and candidates in a single query
    const { data: elections, error } = await supabaseAdmin
      .from('elections')
      .select(`*, positions (*), candidates (*)`)
      .eq('org_id', orgID)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching elections:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ elections }, { status: 200 });
  } catch (err: any) {
    console.error('Unexpected error in get-elections:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}