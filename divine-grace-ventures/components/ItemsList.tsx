'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image'; // Import Image from next/image

interface Item {
  id: number;
  name: string;
  image: string;
}

export default function ItemsList() {
  const [items, setItems] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load and shuffle static items
  useEffect(() => {
    const staticItems: Item[] = [
      { id: 1, name: "Craw Fish", image: "/images/crawfish1.png" },
      { id: 2, name: "Ponmo Ijebu", image: "/images/ponmo1.jpeg" },
      { id: 3, name: "Prawn", image: "/images/prawn1.jpg" },
      { id: 4, name: "Elubo Gbodo", image: "/images/elubo1.webp" },
      { id: 5, name: "Egusi", image: "/images/egusi1.jpeg" },
      { id: 6, name: "Ogbono", image: "/images/ogbono1.jpeg" },
      { id: 7, name: "Dried Fish", image: "/images/dried_fish1.jpg" },
      { id: 8, name: "Palm Oil", image: "/images/palm_oil1.png" },
      { id: 9, name: "Rice", image: "/images/rice1.jpg" },
      { id: 10, name: "Dried Ponmo", image: "/images/dried_ponmo.webp" },
      { id: 11, name: "Cray Fish", image: "/images/crawfish2.jpg" },
      { id: 12, name: "Cray Fish", image: "/images/crawfish3.jpg" },
      { id: 13, name: "Ponmo Ijebu", image: "/images/ponmo2.jpeg" },
      { id: 14, name: "Prawn", image: "/images/prawn2.png" },
      { id: 15, name: "Prawn", image: "/images/prawn3.jpg" },
      { id: 16, name: "Egusi", image: "/images/egusi2.jpeg" },
      { id: 17, name: "Ogbono", image: "/images/ogbono2.png" },
      { id: 18, name: "Ogbono", image: "/images/ogbono3.jpeg" },
      { id: 19, name: "Dried Fish", image: "/images/dried_fish2.jpg" },
      { id: 20, name: "Dried Fish", image: "/images/dried_fish3.jpg" },
      { id: 21, name: "Palm Oil", image: "/images/palm_oil2.jpeg" },
      { id: 22, name: "Palm Oil", image: "/images/palm_oil3.png" },
      { id: 23, name: "Rice", image: "/images/rice2.jpg" },
      { id: 24, name: "Rice", image: "/images/rice3.jpg" },
      { id: 25, name: "Rice", image: "/images/rice3.jpg" },
      { id: 26, name: "Groceries", image: "/images/groceries1.png" },
      { id: 27, name: "Groceries", image: "/images/groceries2.png" },
      { id: 28, name: "Groceries", image: "/images/groceries3.png" },
      { id: 29, name: "Craw Fish", image: "/images/crawfish4.png" },
    ];
    // Shuffle the array randomly
    const shuffledItems = [...staticItems].sort(() => Math.random() - 0.5);
    setItems(shuffledItems);
  }, []);

  // Start an interval to update the currentIndex every 5 seconds (5000ms)
  useEffect(() => {
    if (items.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 2) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items]);

  if (items.length === 0) {
    return <p className="text-center text-white">Loading images...</p>;
  }

  // Get the two items to display; if at the end, wrap around using modulo.
  const firstItem = items[currentIndex];
  const secondItem = items[(currentIndex + 1) % items.length];

  return (
    <div className="flex justify-center items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex} // This key change forces re-animation when the pair updates
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
        >
          <div className="bg-transparent rounded-lg p-4 shadow-lg">
            <Link href="/user ">
              <Image
                src={firstItem.image}
                alt={firstItem.name}
                width={500}
                height={300}
                className="w-full h-64 object-cover rounded-md"
              />
            </Link>
            <h3 className="text-xl font-bold mt-2 text-white text-center">
              {firstItem.name}
            </h3>
          </div>
          <div className="bg-transparent rounded-lg p-4 shadow-lg">
            <Link href="/user">
              <Image
                src={secondItem.image}
                alt={secondItem.name}
                width={500}
                height={300}
                className="w-full h-64 object-cover rounded-md"
              />
            </Link>
            <h3 className="text-xl font-bold mt-2 text-white text-center">
              {secondItem.name}
            </h3>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
