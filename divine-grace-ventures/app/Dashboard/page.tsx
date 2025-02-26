// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaSort } from 'react-icons/fa';
import ProductCard, { Product } from '@/components/ProductCard';
import CustomLoader from '@/components/CustomLoader';
import { useAuth } from '@/context/AuthContext';
import AddToCartModal from '@/components/AddToCartModal';

export default function DashboardHomePage() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'price') return a.price - b.price;
    if (sort === 'availability')
      return a.available === b.available ? 0 : a.available ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  // When a product's "Add to Cart" is clicked, open the modal with the full product details.
  const openAddToCartModal = (product: Product) => {
    setSelectedProduct(product);
  };

  // When the modal form is submitted, add the item to the cart.
  const handleAddToCart = async (userQuantity: number, note: string) => {
    try {
      if (!user || !selectedProduct) throw new Error("User not authenticated or product not selected");
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          product_id: selectedProduct.id,
          user_quantity: userQuantity,
          note,
          price: selectedProduct.price,
          unit: selectedProduct.unit || 'unit',
          image: selectedProduct.image,
          unit_price: selectedProduct.unit_price,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add to cart');
      console.log('Added to cart:', data);
      setSelectedProduct(null);
    } catch (error: any) {
      console.error('Add to cart error:', error.message);
    }
  };

  if (authLoading || loading) return <CustomLoader />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!user) {
    return (
      <div className="text-center p-4">
        <h2>Please refresh this page or go back to log in to view the dashboard</h2>
        {/* Optionally, add a button to redirect to login */}
        <Link href="/user">
          <button className="text-white p-2">Go to Login</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-lg text-white mt-2">Browse our products, make orders, and more.</p>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="relative mb-4 md:mb-0">
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
          <FaSort className="text-white" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sortedProducts.map((product) => (
          <div key={product.id}>
            <ProductCard
              product={product}
              isAdmin={false}
              inCart={false}
              onAddToCart={openAddToCartModal} // Pass full product
            />
          </div>
        ))}
      </div>
      {selectedProduct && (
        <AddToCartModal
          product={selectedProduct}
          onAdd={handleAddToCart}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
