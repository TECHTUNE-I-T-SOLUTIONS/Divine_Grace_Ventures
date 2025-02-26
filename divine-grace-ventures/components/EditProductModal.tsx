// components/EditProductModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Product } from './ProductCard';
import { FaTimes } from 'react-icons/fa';
import CustomLoader from './CustomLoader';

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onUpdate: (updated: Product) => void;
}

export default function EditProductModal({ product, onClose, onUpdate }: EditProductModalProps) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [available, setAvailable] = useState(product.available);
  const [quantity, setQuantity] = useState(product.quantity?.toString() || "");
  const [image, setImage] = useState(product.image || "");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

useEffect(() => {

},);

  const imageSrc =
    product.image && !product.image.startsWith('http')
      ? `/api/proxy-image?filePath=${encodeURIComponent(product.image)}`
      : product.image || '';

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productId', product.id.toString());
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to upload image");
      } else {
        setImage(data.publicURL);
      }
    } catch (err: any) {
      setError(err.message || "Image upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          name,
          price: parseFloat(price),
          available,
          quantity: quantity ? parseInt(quantity, 10) : null,
          image,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update product");
        setLoading(false);
        return;
      }
      if (data && data.data && data.data.id) {
        onUpdate(data.data);
      } else {
        console.error("Updated product is null or missing id", data);
      }
      setLoading(false);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error updating product");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative overflow-auto max-h-[80vh]">
          <button className="absolute top-2 right-2 text-gray-700" onClick={onClose}>
            <FaTimes size={20} />
          </button>
          <h2 className="text-2xl text-black font-bold mb-4">Edit Product</h2>
          <p className="text-sm text-gray-500 mb-4">Product ID: {product.id}</p>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-black border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-black border border-gray-300 rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full text-black border border-gray-300 rounded p-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Availability</label>
              <select
                value={available ? "yes" : "no"}
                onChange={(e) => setAvailable(e.target.value === "yes")}
                className="w-full text-black border border-gray-300 rounded p-2"
              >
                <option value="yes">Available</option>
                <option value="no">Not Available</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Image</label>
              {image && (
                <div className="mb-2">
                  <img src={imageSrc} alt="Product" className="w-full h-32 object-cover rounded" />
                </div>
              )}
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
                className="w-full text-black border border-gray-300 rounded p-2"
              />
              {uploading && <CustomLoader />}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
