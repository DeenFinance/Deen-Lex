import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').trim();
  const year = searchParams.get('year') || '';
  const jurisdiction = searchParams.get('jurisdiction') || 'all';

  try {
    let q = supabase.from('case_law').select('*');

    if (jurisdiction === 'nigeria') q = q.eq('jurisdiction', 'Nigeria');
    if (jurisdiction === 'uk') q = q.eq('jurisdiction', 'United Kingdom');
    if (year) q = q.eq('year', year);

    if (query) {
      const pattern = '"%' + query.replace(/[\\"]/g, '\\$&') + '%"';
      q = q.or(
        `title.ilike.${pattern},citation.ilike.${pattern},summary.ilike.${pattern}`
      );
    }

    const { data: cases, error } = await q.order('year', { ascending: false });
    if (error) throw error;

    return NextResponse.json({ cases });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch cases' },
      { status: 500 }
    );
  }
}
