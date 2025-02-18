// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const productId = Number(params.id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: error?.message || 'Product not found' }, { status: 404 });
    }

    // Generate signed URL for image if exists
    let signedUrl = null;
    if (product.image) {
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('product-images')
        .createSignedUrl(product.image, 60); // URL valid for 60 seconds

      if (signedUrlError) {
        return NextResponse.json({ error: 'Failed to fetch image URL' }, { status: 500 });
      }

      signedUrl = signedUrlData.signedUrl;
    }

    return NextResponse.json({ ...product, image: signedUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
