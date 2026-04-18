'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/lib/products';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (product.stock === 0) {
    return (
      <button
        disabled
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: '#ccc',
          color: '#666',
          border: 'none',
          borderRadius: '40px',
          fontSize: '1rem',
          fontWeight: 500,
          fontFamily: '"Montserrat", sans-serif',
          cursor: 'not-allowed',
        }}
      >
        Hết hàng
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: 500, color: '#1a1a1a', minWidth: '80px' }}>Số lượng:</span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #e0e0e0',
            borderRadius: '30px',
            overflow: 'hidden',
            backgroundColor: '#fff',
          }}
        >
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            style={{
              width: '40px',
              height: '40px',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '1.2rem',
              color: '#1a1a1a',
              cursor: 'pointer',
            }}
          >
            −
          </button>
          <span style={{ width: '50px', textAlign: 'center', fontWeight: 500 }}>{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            style={{
              width: '40px',
              height: '40px',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '1.2rem',
              color: '#1a1a1a',
              cursor: 'pointer',
            }}
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        style={{
          width: '100%',
          padding: '1rem',
          backgroundColor: added ? '#2e7d32' : '#d4af37',
          color: '#fff',
          border: 'none',
          borderRadius: '40px',
          fontSize: '1rem',
          fontWeight: 600,
          fontFamily: '"Montserrat", sans-serif',
          cursor: 'pointer',
          transition: 'background 0.3s',
          boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)',
        }}
      >
        {added ? '✓ Đã thêm vào giỏ hàng!' : 'Thêm vào giỏ hàng'}
      </button>
    </div>
  );
}