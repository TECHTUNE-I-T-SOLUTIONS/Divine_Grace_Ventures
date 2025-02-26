// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Card } from '@nextui-org/react';
import { FaPlus, FaTag, FaDollarSign, FaListUl } from 'react-icons/fa';
import CustomAlert from '@/components/CustomAlert';
import CustomLoader from '@/components/CustomLoader';
import OrderCard, { Order } from '@/components/OrderCard';
import { useAuth } from '@/context/AuthContext';

export default function AdminHomePage() {
  const { user } = useAuth(); // Get the logged-in admin details
  // Form states
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductAvailable, setNewProductAvailable] = useState(true);
  const [newProductImage, setNewProductImage] = useState(''); // will store the file path
  const [newProductQuantity, setNewProductQuantity] = useState('');
  const [newProductUnit, setNewProductUnit] = useState('');
  const [newProductUnitPrice, setNewProductUnitPrice] = useState('');
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        // Fetch all orders from your API endpoint (ensure it returns { orders: [...] })
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
        setOrders(data.orders);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);


  // Handle file upload via API endpoint (using Supabase Storage)
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', message: data.error || 'Failed to upload image' });
      } else {
        // The API returns a filePath like "products/123456789.jpg"
        setNewProductImage(data.filePath);
        setAlert({ type: 'success', message: 'Image uploaded successfully!' });
      }
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Image upload error' });
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProductName,
          price: parseFloat(newProductPrice),
          available: newProductAvailable,
          image: newProductImage,
          quantity: parseInt(newProductQuantity, 10),
          unit: newProductUnit,
          unit_price: parseFloat(newProductUnitPrice)
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', message: data.error || 'Failed to add product' });
        setLoading(false);
        return;
      }
      setAlert({ type: 'success', message: 'Product added successfully!' });
      // Clear form fields
      setNewProductName('');
      setNewProductPrice('');
      setNewProductImage('');
      setNewProductQuantity('');
      setNewProductUnit('');
      setNewProductUnitPrice('');
      
      setLoading(false);
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Error adding product' });
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <CustomLoader />}
      <div className="min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-4 text-center">Admin Dashboard</h2>
          {alert && <CustomAlert type={alert.type} message={alert.message} />}
          <p className="mb-6 break-words text-center">
            Manage orders, update inventory, send notifications, track payments, and settle disputes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Add New Product Section */}
            <div>
              <Card className="bg-gray-800 rounded-xl shadow-lg" css={{ p: '2rem' }}>
                <h3 className="text-xl mt-2 text-center font-bold mb-4">Add New Product</h3>
                <Input
                  placeholder="Product Name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  fullWidth
                  contentLeft={<FaTag className="text-gray-400" />}
                  className="m-2 w-auto mb-4 bg-gray-700 rounded-lg"
                />
                <Input
                  placeholder="Product Price"
                  type="number"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  fullWidth
                  contentLeft={<FaDollarSign className="text-gray-400" />}
                  className="m-2 w-auto mb-4 bg-gray-700 rounded-lg"
                />
                <div className="p-2 mb-4">
                  <label className="block mb-1 text-white">Product Image</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                  />
                  {uploading && <p className="text-sm text-gray-300 mt-1">Uploading image...</p>}
                  {newProductImage && (
                    // Use the proxy to display the image from the stored file path
                    <img 
                      src={`/api/proxy-image?filePath=${encodeURIComponent(newProductImage)}`} 
                      alt="Product" 
                      className="p-2 mt-2 rounded-lg max-h-32" 
                    />
                  )}
                </div>
                <Input
                  placeholder="Available Quantity"
                  type="number"
                  value={newProductQuantity}
                  onChange={(e) => setNewProductQuantity(e.target.value)}
                  fullWidth
                  contentLeft={<FaListUl className="text-gray-400" />}
                  className="m-2 w-auto mb-4 bg-gray-700 rounded-lg"
                />
                <Input
                  placeholder="Unit (e.g., bag, cup)"
                  value={newProductUnit}
                  onChange={(e) => setNewProductUnit(e.target.value)}
                  fullWidth
                  className="m-2 w-auto mb-4 bg-gray-700 rounded-lg"
                />
                <Input
                  placeholder="Unit Price"
                  type="number"
                  value={newProductUnitPrice}
                  onChange={(e) => setNewProductUnitPrice(e.target.value)}
                  fullWidth
                  className="m-2 w-auto mb-4 bg-gray-700 rounded-lg"
                />
                <div className="p-2 mb-4">
                  <select
                    value={newProductAvailable ? 'yes' : 'no'}
                    onChange={(e) => setNewProductAvailable(e.target.value === 'yes')}
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                  >
                    <option value="yes" className="w-auto">Available</option>
                    <option value="no" className="w-auto">Not Available</option>
                  </select>
                </div>
                <Button
                  auto
                  icon={<FaPlus className="mr-1" />}
                  onClick={handleAddProduct}
                  className="m-2 font-bold bg-blue-700 hover:bg-blue-900 rounded-full"
                >
                  Add Product
                </Button>
              </Card>
            </div>
            {/* Recent Orders Section */}
            <div>
              <Card className="p-2 bg-gray-800 rounded-xl shadow-lg" css={{ p: '2rem' }}>
                <h3 className="text-xl text-center font-bold mb-4">Recent Orders</h3>
                {orders.length === 0 ? (
                  <p>No orders found.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <OrderCard key={order.id} order={{ ...order, adminView: true }} />
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
          {/* Additional sections for notifications, payment tracking, etc., can be added here */}
        </div>
      </div>
    </>
  );
}
