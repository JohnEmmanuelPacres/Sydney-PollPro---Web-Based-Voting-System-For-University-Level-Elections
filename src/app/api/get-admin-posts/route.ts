import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { admin_id, administered_org } = body;

    if (!admin_id || !administered_org) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get organization ID
    const { data: org, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .eq('organization_name', administered_org)
      .single();

    if (orgError) {
      console.error('Error fetching organization:', orgError);
      return NextResponse.json({ error: orgError.message }, { status: 500 });
    }

    // Fetch posts from admin's organization and university level posts they created
    const { data: posts, error: postsError } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        admin_profiles!posts_admin_id_fkey(
          email,
          administered_org
        )
      `)
      .or(`org_id.eq.${org.id},and(admin_id.eq.${admin_id},is_uni_lev.eq.true)`)
      .order('created_at', { ascending: false });

    if (postsError) {
      console.error('Error fetching admin posts:', postsError);
      return NextResponse.json({ error: postsError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      posts: posts || [] 
    }, { status: 200 });

  } catch (error) {
    console.error('Error in get-admin-posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin posts', details: String(error) },
      { status: 500 }
    );
  }
} 