// components/ProductCard.tsx
'use client';

import { Card, Text, Button } from '@nextui-org/react';
import { FaCartPlus, FaCheck, FaEdit, FaTrash } from 'react-icons/fa';

export interface Product {
  id: number;
  name: string;
  price: number;
  available: boolean;
  image?: string;
  quantity?: number;
}

interface ProductCardProps {
  product: Product;
  /** Set to true when the current view is for an admin */
  isAdmin?: boolean;
  /** Indicates if the product is already in the user's cart */
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
    <Card css={{ mw: "400px" }} variant="bordered">
      <Card.Header>
        <Text b>{product.name}</Text>
      </Card.Header>
      <Card.Body css={{ p: 0 }}>
        {product.image ? (
          <Card.Image src={product.image} objectFit="cover" width="100%" height={140} alt={product.name} />
        ) : (
          <div className="h-32 bg-gray-600 flex items-center justify-center">
            <Text color="white" size={24}>
              {product.name.charAt(0)}
            </Text>
          </div>
        )}
        <div className="p-4">
          <Text>Price: ${product.price}</Text>
          <Text color={product.available ? "success" : "error"}>
            {product.available ? "Available" : "Out of Stock"}
          </Text>
          {isAdmin ? (
            <div className="flex space-x-2 mt-4">
              <Button auto bordered color="primary" onClick={() => onEdit && onEdit(product)}>
                <FaEdit className="mr-1" />
                Edit
              </Button>
              <Button auto bordered color="error" onClick={() => onDelete && onDelete(product.id)}>
                <FaTrash className="mr-1" />
                Delete
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              {inCart ? (
                <Button disabled auto color="success">
                  <FaCheck className="mr-1" />
                  In Cart
                </Button>
              ) : (
                <Button auto onClick={() => onAddToCart && onAddToCart(product.id)}>
                  <FaCartPlus className="mr-1" />
                  Add to Cart
                </Button>
              )}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
