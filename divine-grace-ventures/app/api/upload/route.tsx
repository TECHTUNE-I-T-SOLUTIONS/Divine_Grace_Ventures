import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Upload file to bucket "images"
    const { error } = await supabase.storage.from('images').upload(filePath, file);
    if (error) {
      console.error("Upload error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Instead of trying to get a public URL (which returns null),
    // we return the file path.
    if (productId) {
      const numericId = Number(productId);
      const { error: updateError } = await supabase
        .from('products')
        .update({ image: filePath })
        .eq('id', numericId);
      if (updateError) {
        console.error("Update error:", updateError.message);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
      console.log("Updated product id", numericId, "with file path:", filePath);
    }

    return NextResponse.json({ filePath });
  } catch (error: unknown) { // Changed 'any' to 'unknown'
    console.error('Error uploading file:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
