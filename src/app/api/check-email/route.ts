import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use the service role key for admin access
);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    let page = 1;
    const perPage = 1000;
    let found = false;

    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
      if (error) {
        return NextResponse.json({ exists: false, error: error.message }, { status: 200 });
      }
      if (data?.users?.some((user) => user.email?.toLowerCase() === email.toLowerCase())) {
        found = true;
        break;
      }
      if (!data?.users || data.users.length < perPage) {
        // No more users to fetch
        break;
      }
      page++;
    }

    if (found) {
      return NextResponse.json({ exists: true }, { status: 200 });
    }
    return NextResponse.json({ exists: false }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ exists: false, error: 'Server error' }, { status: 500 });
  }
} 