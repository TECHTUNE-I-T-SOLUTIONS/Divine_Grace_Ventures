// components/ProductCard.tsx
'use client';

import Image from 'next/image';
import { FaCartPlus, FaCheck, FaEdit, FaTrash } from 'react-icons/fa';

export interface Product {
  id: number;
  name: string;
  price: number;
  available: boolean;
  image?: string; // This should be a public URL
  quantity?: number;
}

interface ProductCardProps {
  product: Product;
  /** When true, show admin controls; otherwise, user controls */
  isAdmin?: boolean;
  /** For user view: whether the product is already in the cart */
  inCart?: boolean;
  onAddToCart?: (productId: number) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: number) => void;
}

export default function ProductCard({
  product,
  isAdmin = false,
  inCart = false,
  onAddToCart,
  onEdit,
  onDelete,
}: ProductCardProps) {
  return (
    <div className="max-w-md border border-gray-300 rounded-lg overflow-hidden shadow-md">
      <div className="px-4 py-2 bg-gray-100">
        <h3 className="text-lg text-black font-bold">{product.name}</h3>
      </div>
      <div>
        {product.image ? (
          <div className="relative w-full h-36">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-36 bg-gray-600 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {product.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="px-4 py-2">
        <p className="text-gray-800">Price: ${product.price}</p>
        <p className={product.available ? "text-green-500" : "text-red-500"}>
          {product.available ? "Available" : "Out of Stock"}
        </p>
        {isAdmin ? (
          <div className="flex space-x-2 mt-4">
            <button
              className="border border-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition-colors"
              onClick={() => onEdit && onEdit(product)}
            >
              <FaEdit className="inline mr-1" />
              Edit
            </button>
            <button
              className="border border-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition-colors"
              onClick={() => onDelete && onDelete(product.id)}
            >
              <FaTrash className="inline mr-1" />
              Delete
            </button>
          </div>
        ) : (
          <div className="mt-4">
            {inCart ? (
              <button
                disabled
                className="border border-green-500 text-green-500 px-3 py-1 rounded"
              >
                <FaCheck className="inline mr-1" />
                In Cart
              </button>
            ) : (
              <button
                className="border border-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition-colors"
                onClick={() => onAddToCart && onAddToCart(product.id)}
              >
                <FaCartPlus className="inline mr-1" />
                Add to Cart
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
