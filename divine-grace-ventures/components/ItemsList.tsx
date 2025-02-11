// components/ItemsList.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export default function ItemsList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchItems() {
      // Assuming you have an "items" table in Supabase with the appropriate columns
      const { data, error } = await supabase.from<Item>('items').select('*');
      if (error) {
        console.error('Error fetching items:', error);
      } else {
        setItems(data ?? []);
      }
      setLoading(false);
    }
    fetchItems();
  }, []);

  if (loading) {
    return <p className="text-center">Loading items...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="bg-gray-800 rounded-lg p-4 shadow-lg"
        >
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-48 object-cover rounded-md"
          />
          <h3 className="text-xl font-bold mt-2">{item.name}</h3>
          <p className="mt-1">{item.description}</p>
          <p className="mt-2 font-semibold">${item.price}</p>
        </motion.div>
      ))}
    </div>
  );
}
