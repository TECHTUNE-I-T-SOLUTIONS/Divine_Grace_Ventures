import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('filePath');
    if (!filePath) {
      return NextResponse.json({ error: 'Missing filePath parameter' }, { status: 400 });
    }

    // Create a signed URL valid for 1 hour (3600 seconds)
    const { data, error } = await supabase.storage
      .from('images')
      .createSignedUrl(filePath, 3600);

    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: error?.message || 'Could not create signed URL' }, { status: 500 });
    }

    // Redirect to the signed URL so the image is served.
    return NextResponse.redirect(data.signedUrl);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
