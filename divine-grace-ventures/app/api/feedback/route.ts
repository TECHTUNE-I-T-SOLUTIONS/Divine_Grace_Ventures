// app/api/feedback/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Explicitly type 'req' as 'Request'
export async function POST(req: Request) {
    const supabase = createRouteHandlerClient({ cookies });

    const { user_id, message } = await req.json();

    if (!user_id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('feedback')
        .insert([{ user_id, message }]);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
}

export async function GET() {
    const supabase = createRouteHandlerClient({ cookies });

    const { data, error } = await supabase
        .from('feedback')
        .select('user_id, message, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}
