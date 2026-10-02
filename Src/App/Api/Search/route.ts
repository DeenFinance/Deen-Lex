import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const year = searchParams.get('year') || '';

  try {
    let supabaseQuery = supabase
      .from('case_law')
      .select('*')
      .eq('jurisdiction', 'Nigeria');

    if (year) {
      supabaseQuery = supabaseQuery.eq('year', year);
    }

    if (query) {
      // Searches across title, citation, or summary
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,citation.ilike.%${query}%,summary.ilike.%${query}%`
      );
    }

    const { data: cases, error } = await supabaseQuery.order('year', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ cases });
  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch cases" }, { status: 500 });
  }
}