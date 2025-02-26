// components/ProductCard.tsx
'use client';

import Image from 'next/image';
import { FaCartPlus, FaCheck, FaEdit, FaTrash } from 'react-icons/fa';

export interface Product {
  id: number;
  name: string;
  price: number;
  available: boolean;
  image?: string; // Either a file path (e.g., "products/1739640706207.jpg") or a full URL
  quantity?: number;
  unit?: string;       // e.g., "bag", "cup"
  unit_price?: number; // Price per unit measure
}

interface ProductCardProps {
  product: Product;
  /** When true, show admin controls; otherwise, user controls */
  isAdmin?: boolean;
  /** For user view: whether the product is already in the cart */
  inCart?: boolean;
  onAddToCart?: (product: Product) => void;
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
  // If product.image doesn't start with "http", assume it's a file path stored in the DB.
  // Use the proxy endpoint to generate a signed URL.
  const imageSrc =
    product.image && !product.image.startsWith('http')
      ? `/api/proxy-image?filePath=${encodeURIComponent(product.image)}`
      : product.image || '';

  return (
    <div className="max-w-md border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="px-2 py-2 bg-gray-100">
        <h3 className="text-lg text-center text-black font-bold">{product.name}</h3>
      </div>
      <div>
        {imageSrc ? (
          <div className="relative w-full h-36">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="100vw"
              className="object-cover"
              unoptimized
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
        <p className="text-white">
          Price: ₦{product.price}
        </p>
        {product.unit_price && (
          <p className="text-sm text-gray-300">
            Unit Price: ₦{product.unit_price}
            {product.unit ? ` per ${product.unit}` : ''}
          </p>
        )}
        <p className={product.available ? "text-green-500" : "text-red-500"}>
          {product.available ? "Available" : "Out of Stock"}
        </p>
        {isAdmin ? (
          <div className="flex space-x-2 mt-4">
            <button
              className="border border-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition-colors"
              title="Edit"
              onClick={() => onEdit && onEdit(product)}
            >
              <FaEdit className="inline mr-1" />
              Edit
            </button>
            <button
              className="border border-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition-colors"
              title="Delete"
              onClick={() => onDelete && onDelete(product.id)}
            >
              <FaTrash className="inline mr-1" />
              Delete
            </button>
          </div>
        ) : (
          <div className="mt-4">
            {inCart ? (
              <button disabled className="border border-green-500 text-green-500 px-3 py-1 rounded"
              title="In Cart">
                <FaCheck className="inline mr-1" />
                In Cart
              </button>
            ) : (
              <button
                className="border border-blue-400 text-blue-300 px-3 py-1 rounded hover:bg-white hover:text-black transition-colors"
                title="Add to Cart"
                onClick={() => onAddToCart && onAddToCart(product)}
                disabled={!product.available}
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
