import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, user_type, department_org } = body;

    console.log('API: Fetching posts for:', {
      user_id: body.user_id,
      user_type: body.user_type,
      department_org: body.department_org
    });

    // For guest users, user_id and user_type can be null
    if (user_type && user_type !== 'guest' && !user_id) {
      console.log('API: Missing user_id for authenticated user');
      return NextResponse.json({ error: 'Missing user_id for authenticated user' }, { status: 400 });
    }

    let query = supabaseAdmin
      .from('posts')
      .select(`
        *,
        organizations!posts_org_id_fkey(organization_name),
        admin_profiles!posts_admin_id_fkey(
          email,
          administered_org
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters based on user type and organization
    if ((user_type === 'admin' || user_type === 'voter') && department_org) {
      // First, look up the organization UUID using the organization name
      const { data: org, error: orgError } = await supabaseAdmin
        .from('organizations')
        .select('id')
        .eq('organization_name', department_org)
        .single();

      if (orgError) {
        console.error('Error fetching organization:', orgError);
        // If organization lookup fails, just show university level posts
        query = query.eq('is_uni_lev', true);
      } else {
        // Use the organization UUID in the query
        query = query.or(`org_id.eq.${org.id},is_uni_lev.eq.true`);
      }
    } else if (user_type === 'admin' || user_type === 'voter') {
      // If no department_org, just show university level posts
      query = query.eq('is_uni_lev', true);
    } else {
      // For unauthenticated users (guests), only show university level posts
      query = query.eq('is_uni_lev', true);
    }

    console.log('API: Executing query...');
    const { data: posts, error: postsError } = await query;

    if (postsError) {
      console.error('API: Full error details:', {
        message: postsError.message,
        details: postsError.details,
        hint: postsError.hint,
        code: postsError.code
      });
      return NextResponse.json({ 
        error: postsError.message,
        details: postsError.details 
      }, { status: 500 });
    }

    console.log('API: Successfully fetched posts:', posts?.length || 0);
    return NextResponse.json({ 
      success: true, 
      posts: posts || [] 
    }, { status: 200 });

  } catch (error) {
    console.error('API: Error in get-posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: String(error) },
      { status: 500 }
    );
  }
} 