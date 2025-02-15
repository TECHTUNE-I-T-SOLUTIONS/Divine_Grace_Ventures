// app/admin/page.tsx
'use client';

import { useState } from 'react';
import { Button, Input, Card } from '@nextui-org/react';
import { FaPlus, FaTag, FaDollarSign, FaImage, FaListUl } from 'react-icons/fa';
import CustomAlert from '@/components/CustomAlert';
import CustomLoader from '@/components/CustomLoader';

export default function AdminHomePage() {
  // Form states
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductAvailable, setNewProductAvailable] = useState(true);
  const [newProductImage, setNewProductImage] = useState(''); // will store public URL
  const [newProductQuantity, setNewProductQuantity] = useState('');
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle file upload via the API endpoint that uses Supabase Storage
  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    // Optionally, if updating an existing product, you can append a productId:
    // formData.append('productId', productId);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', message: data.error || 'Failed to upload image' });
      } else {
        setNewProductImage(data.publicURL);
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
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', message: data.error || 'Failed to add product' });
        setLoading(false);
        return;
      }
      setAlert({ type: 'success', message: 'Product added successfully!' });
      // Clear form fields after successful submission
      setNewProductName('');
      setNewProductPrice('');
      setNewProductImage('');
      setNewProductQuantity('');
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
                <h3 className="text-xl font-bold mb-4">Add New Product</h3>
                {/* Product Name */}
                <Input
                  placeholder="Product Name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  fullWidth
                  contentLeft={<FaTag className="text-gray-400" />}
                  className="mb-4 bg-gray-700 rounded-lg"
                />
                {/* Product Price */}
                <Input
                  placeholder="Product Price"
                  type="number"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  fullWidth
                  contentLeft={<FaDollarSign className="text-gray-400" />}
                  className="mb-4 bg-gray-700 rounded-lg"
                />
                {/* Product Image Upload */}
                <div className="mb-4">
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
                    <img src={newProductImage} alt="Product" className="mt-2 rounded-md max-h-32" />
                  )}
                </div>
                {/* Available Quantity */}
                <Input
                  placeholder="Available Quantity"
                  type="number"
                  value={newProductQuantity}
                  onChange={(e) => setNewProductQuantity(e.target.value)}
                  fullWidth
                  contentLeft={<FaListUl className="text-gray-400" />}
                  className="mb-4 bg-gray-700 rounded-lg"
                />
                {/* Availability Dropdown */}
                <div className="mb-4">
                  <select
                    value={newProductAvailable ? 'yes' : 'no'}
                    onChange={(e) => setNewProductAvailable(e.target.value === 'yes')}
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                  >
                    <option value="yes">Available</option>
                    <option value="no">Not Available</option>
                  </select>
                </div>
                <Button
                  auto
                  icon={<FaPlus className="mr-1" />}
                  onClick={handleAddProduct}
                  className="w-full bg-blue-500 hover:bg-blue-600 rounded-full"
                >
                  Add Product
                </Button>
              </Card>
            </div>
            {/* Recent Orders Section */}
            <div>
              <Card className="bg-gray-800 rounded-xl shadow-lg" css={{ p: '2rem' }}>
                <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
                <p className="break-words">
                  This section will display recent orders. (You can expand this area with a table or list as needed.)
                </p>
              </Card>
            </div>
          </div>
          {/* Additional sections for notifications, payment tracking, etc., can be added here */}
        </div>
      </div>
    </>
  );
}
