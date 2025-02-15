// app/api/admin/payments/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Assume you have a payments table with fields: id, order_id, amount, status, date
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('date', { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ payments: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
