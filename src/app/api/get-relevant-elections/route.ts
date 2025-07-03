import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const Org = searchParams.get('department_org') || searchParams.get('administered_Org');
    if (!Org) {
      return NextResponse.json({ error: 'Missing department_org parameter' }, { status: 400 });
    }

    // Find the org_id for the given departmentOrg
    const { data: orgs, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .eq('organization_name', Org)
      .limit(1);

    if (orgError || !orgs || orgs.length === 0) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const org_id = orgs[0].id;

    // Fetch all ongoing or upcoming elections for this org_id
    const currentTime = new Date().toISOString();
    const { data: elections, error: electionsError } = await supabaseAdmin
      .from('elections')
      .select('*')
      .eq('org_id', org_id)
      .gte('end_date', currentTime)
      .order('start_date', { ascending: true });

    if (electionsError) {
      return NextResponse.json({ error: electionsError.message }, { status: 500 });
    }

    // Find the most relevant election: ongoing (start_date <= now <= end_date) or next upcoming
    let relevantElection = null;
    if (elections && elections.length > 0) {
      const now = new Date(currentTime);
      relevantElection = elections.find(e => new Date(e.start_date) <= now && new Date(e.end_date) >= now)
        || elections[0]; // fallback to the next upcoming if none ongoing
    } //WALAY SURE NI AY

    let type = null;
    if (relevantElection) {
      type = relevantElection.is_uni_level ? 'university' : 'organization';
    }

    return NextResponse.json({ type, election: relevantElection, Org: Org }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch relevant election type', details: String(error) },
      { status: 500 }
    );
  }
} 