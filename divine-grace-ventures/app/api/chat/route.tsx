import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Define a strict type for your payload
interface ChatPayload {
    message: string;
    sender_role: 'admin' | 'user';
    admin_id?: number;
    user_id?: string;
}

export async function POST(req: Request): Promise<NextResponse> {
    const supabase = createRouteHandlerClient({ cookies });

    try {
        const { message, receiverId, senderRole } = await req.json() as {
            message: string;
            receiverId: string;
            senderRole: 'admin' | 'user';
        };

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const chatPayload: ChatPayload = {
            message,
            sender_role: senderRole,
        };

        if (senderRole === 'admin') {
            chatPayload.admin_id = parseInt(user.id); 
            chatPayload.user_id = receiverId;         
        } else if (senderRole === 'user') {
            chatPayload.user_id = user.id;            
            chatPayload.admin_id = parseInt(receiverId); 
        } else {
            return NextResponse.json({ error: 'Invalid sender role' }, { status: 400 });
        }

        const { data, error } = await supabase.from('chats').insert([chatPayload]);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: unknown) {
        console.error('Chat POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(): Promise<NextResponse> {
    const supabase = createRouteHandlerClient({ cookies });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('chats')
        .select('*')
        .or(`admin_id.eq.${user.id},user_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}
