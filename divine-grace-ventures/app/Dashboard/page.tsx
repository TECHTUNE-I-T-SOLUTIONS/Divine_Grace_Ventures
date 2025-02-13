'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaSort } from 'react-icons/fa';
import { Grid, Text } from '@nextui-org/react';
import ProductCard, { Product } from '@/components/ProductCard';

export default function DashboardHomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'price') return a.price - b.price;
    if (sort === 'availability') return a.available === b.available ? 0 : a.available ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  const handleAddToCart = (id: number) => {
    // Add your "add to cart" logic here
    console.log('Add to cart product ID:', id);
  };

  if (loading) return <div className="text-white text-center py-8">Loading products...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <FaSort />
          <select
            className="bg-gray-700 text-white rounded p-2"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="availability">Availability</option>
          </select>
        </div>
      </div>

      <Grid.Container gap={2}>
        {sortedProducts.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={4}>
            <ProductCard
              product={product}
              isAdmin={false}
              inCart={false}
              onAddToCart={handleAddToCart}
            />
          </Grid>
        ))}
      </Grid.Container>
    </div>
  );
}
