// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Service role key (keep secure)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    // Optionally, a productId can be passed to update an existing product's image URL.
    const productId = formData.get('productId');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate a unique file name using the current timestamp and file extension
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Upload the file to a storage bucket called "images"
    const { data, error } = await supabase.storage.from('images').upload(filePath, file);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Retrieve the public URL for the uploaded file
    const { publicURL, error: urlError } = supabase.storage.from('images').getPublicUrl(filePath);
    if (urlError) {
      return NextResponse.json({ error: urlError.message }, { status: 500 });
    }

    // If a productId is provided, update the product record's image column with the public URL
    if (productId) {
      const { data: updateData, error: updateError } = await supabase
        .from('products')
        .update({ image: publicURL })
        .eq('id', productId);
      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ publicURL });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
