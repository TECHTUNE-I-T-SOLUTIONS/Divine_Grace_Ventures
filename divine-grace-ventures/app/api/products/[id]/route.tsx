import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Manually type the context (This is the key!)
interface RouteContext {
    params: {
        id: string;
    };
}

// GET Handler
export async function GET(
    req: NextRequest,
    context: RouteContext // Manually apply the type to `context`
) {
    const { id } = context.params;

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
