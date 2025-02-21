// app/api/admin/payments/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  try {
    // Parse query parameters from the URL
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    // Start building the query: order by payment_date (ensure your table has this column)
    let query = supabase
      .from('payments')
      .select('*')
      .order('payment_date', { ascending: false });

    // If a user_id is provided, filter the results
    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ payments: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
