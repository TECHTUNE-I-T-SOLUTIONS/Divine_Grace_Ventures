'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Card } from '@nextui-org/react';
import { FaPlus, FaTag, FaDollarSign, FaListUl } from 'react-icons/fa';
import CustomAlert from '@/components/CustomAlert';
import CustomLoader from '@/components/CustomLoader';
import Image from 'next/image';

// ✅ Define the Order type
type Order = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  status: string;
};

export default function AdminHomePage() {
  const [newProductName, setNewProductName] = useState<string>('');
  const [newProductPrice, setNewProductPrice] = useState<string>('');
  const [newProductAvailable, setNewProductAvailable] = useState<boolean>(true);
  const [newProductImage, setNewProductImage] = useState<string>('');
  const [newProductQuantity, setNewProductQuantity] = useState<string>('');
  const [newProductUnit, setNewProductUnit] = useState<string>('');
  const [newProductUnitPrice, setNewProductUnitPrice] = useState<string>('');
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // ✅ Fix the order state
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
        setOrders(data.orders);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setAlert({ type: 'error', message: err.message });
        } else {
          setAlert({ type: 'error', message: 'An unknown error occurred' });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [setOrders]);  // ✅ Add setOrders to dependency array


  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', message: data.error || 'Failed to upload image' });
      } else {
        setNewProductImage(data.filePath);
        setAlert({ type: 'success', message: 'Image uploaded successfully!' });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAlert({ type: 'error', message: error.message || 'Image upload error' });
      } else {
        setAlert({ type: 'error', message: 'An unknown error occurred during upload' });
      }
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
      setNewProductName('');
      setNewProductPrice('');
      setNewProductImage('');
      setNewProductQuantity('');
      setNewProductUnit('');
      setNewProductUnitPrice('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAlert({ type: 'error', message: error.message || 'Error adding product' });
      } else {
        setAlert({ type: 'error', message: 'An unknown error occurred while adding product' });
      }
    } finally {
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
              <Card className="bg-gray-800 rounded-xl shadow-lg p-8">
                <h3 className="text-xl mt-2 text-center font-bold mb-4">Add New Product</h3>
                <Input
                  placeholder="Product Name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  fullWidth
                  startContent={<FaTag className="text-gray-400" />}
                  className="m-2 w-auto mb-4 bg-gray-700 rounded-lg"
                />
                <Input
                  placeholder="Product Price"
                  type="number"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  fullWidth
                  startContent={<FaDollarSign className="text-gray-400" />}
                  className="m-2 w-auto mb-4 bg-gray-700 rounded-lg"
                />
                <div className="p-2 mb-4">
                  <label className="block mb-1 text-white">Product Image</label>
                  <input
                    type="file"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                  />
                  {uploading && <p className="text-sm text-gray-300 mt-1">Uploading image...</p>}
                  {newProductImage && (
                    <Image
                      src={`/api/proxy-image?filePath=${encodeURIComponent(newProductImage)}`}
                      alt="Product"
                      width={200}
                      height={200}
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
                  startContent={<FaListUl className="text-gray-400" />}
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

                <select
                  value={newProductAvailable ? 'yes' : 'no'}
                  onChange={(e) => setNewProductAvailable(e.target.value === 'yes')}
                  className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                >
                  <option value="yes">Available</option>
                  <option value="no">Not Available</option>
                </select>

                <Button onClick={handleAddProduct} className="mt-4">
                  <FaPlus className="mr-2" /> Add Product
                </Button>
              </Card>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-2">Product Name</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-600">
                    <td className="px-4 py-2">{order.productName}</td>
                    <td className="px-4 py-2">{order.quantity}</td>
                    <td className="px-4 py-2">${order.price.toFixed(2)}</td>
                    <td className="px-4 py-2">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
