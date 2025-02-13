'use client';

import { useState } from 'react';
import { Button, Input, Card } from '@nextui-org/react';
import { FaPlus } from 'react-icons/fa';
import CustomAlert from '@/components/CustomAlert';

export default function AdminHomePage() {
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductAvailable, setNewProductAvailable] = useState(true);
  const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);

  const handleAddProduct = async () => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProductName,
          price: parseFloat(newProductPrice),
          available: newProductAvailable,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert({ type: 'error', message: data.error || 'Failed to add product' });
        return;
      }
      setAlert({ type: 'success', message: 'Product added successfully!' });
      setNewProductName('');
      setNewProductPrice('');
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Error adding product' });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
      {alert && <CustomAlert type={alert.type} message={alert.message} />}
      <p className="mb-6">
        This dashboard lets you manage orders, update inventory, send notifications, track payments, and settle disputes.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <Card css={{ p: '2rem' }}>
            <h3 className="text-xl font-bold mb-2">Add New Product</h3>
            <Input
              label="Product Name"
              placeholder="Enter product name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              fullWidth
            />
            <Input
              label="Price"
              placeholder="Enter product price"
              type="number"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              fullWidth
              className="mt-4"
            />
            <div className="mt-4">
              <label className="mr-2">Available:</label>
              <select
                value={newProductAvailable ? 'yes' : 'no'}
                onChange={(e) => setNewProductAvailable(e.target.value === 'yes')}
                className="px-3 py-2 rounded bg-gray-700 text-white"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <Button
              auto
              icon={<FaPlus className="mr-1" />}
              className="mt-4"
              onClick={handleAddProduct}
            >
              Add Product
            </Button>
          </Card>
        </div>
        <div>
          <Card css={{ p: '2rem' }}>
            <h3 className="text-xl font-bold mb-2">Recent Orders</h3>
            <p>This section will display recent orders.</p>
          </Card>
        </div>
      </div>
      {/* Additional sections for notifications, payment tracking, etc., can be added here */}
    </div>
  );
}
