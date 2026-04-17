'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { Product } from '@/lib/products';

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (product.stock === 0) {
    return (
      <button disabled className="w-full bg-gray-300 text-gray-600 py-3 rounded-md font-medium cursor-not-allowed">
        Hết hàng
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch">
      <div className="flex items-center border border-gray-300 rounded-md">
        <button
          onClick={() => setQuantity(q => Math.max(1, q - 1))}
          className="px-4 py-3 text-xl"
        >
          −
        </button>
        <span className="px-4 py-3 text-center min-w-12">{quantity}</span>
        <button
          onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
          className="px-4 py-3 text-xl"
        >
          +
        </button>
      </div>
      <button
        onClick={handleAddToCart}
        className={`flex-1 py-3 rounded-md font-medium transition ${
          added
            ? 'bg-green-600 text-white'
            : 'bg-gold text-white hover:bg-amber-600'
        }`}
      >
        {added ? 'Đã thêm vào giỏ!' : 'Thêm vào giỏ hàng'}
      </button>
    </div>
  );
}