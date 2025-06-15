import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

type Params = {
  params: {
    id: string;
  };
};

export async function GET(
  req: NextRequest,
  { params }: Params
) {
  const id = params.id;

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
