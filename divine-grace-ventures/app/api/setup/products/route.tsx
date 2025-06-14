import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST() {
  try {
    // Check if the products table exists (Supabase doesn’t support metadata queries via client)
    // So, just attempt to select with a limit
    const { error } = await supabase.from('products').select('*').limit(1);

    if (error) {
      // If the table doesn't exist, error.code might be "42P01" (undefined table)
      if (error.code === '42P01') {
        // Supabase client does not support table creation
        return NextResponse.json({
          error: "Table 'products' does not exist. Please create it manually via Supabase SQL Editor."
        }, { status: 500 });
      }

      // Other errors
      throw error;
    }

    return NextResponse.json({ message: 'Products table exists.' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
