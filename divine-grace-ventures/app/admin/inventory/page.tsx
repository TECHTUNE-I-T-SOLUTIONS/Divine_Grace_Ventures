'use client';

import { useState, useEffect } from 'react';
import { Grid, Text } from '@nextui-org/react';
import ProductCard, { Product } from '@/components/ProductCard';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch products');
        setProducts(data.products);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    console.log('Edit product:', product);
    // Implement navigation to an edit page or open a modal for editing
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete product');
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  if (loading) return <div className="text-white text-center py-8">Loading inventory...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div>
      <Text h2 className="mb-4">Inventory</Text>
      <Grid.Container gap={2}>
        {products.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={4}>
            <ProductCard
              product={product}
              isAdmin={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid.Container>
    </div>
  );
}
