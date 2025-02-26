'use client';

import { useState, useEffect } from 'react';
import ProductCard, { Product } from '@/components/ProductCard';
import CustomLoader from '@/components/CustomLoader';
import EditProductModal from '@/components/EditProductModal';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch products');
        setProducts(data.products);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
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

  if (loading) return <CustomLoader />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="p-4 bg-gradient-to-r from-indigo-900 to-purple-900 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-4">Inventory</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard
              product={product}
              isAdmin={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={(updatedProduct: Product) => {
            if (updatedProduct && updatedProduct.id) {
              setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
            } else {
              console.error("Updated product is null or missing id", updatedProduct);
            }
          }}
        />
      )}
    </div>
  );
}
