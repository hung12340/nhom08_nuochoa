'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/lib/products';

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem({ id: product.id, name: product.name, price: product.price, image: product.images[0] });
    setAdded(true); setTimeout(() => setAdded(false), 2000);
  };

  if (!product.stock) return <button disabled style={{ width: '100%', padding: '1rem', backgroundColor: '#ccc', color: '#666', border: 'none', borderRadius: '40px', fontSize: '1rem', fontWeight: 500, fontFamily: '"Montserrat", sans-serif', cursor: 'not-allowed' }}>Hết hàng</button>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: 500, color: '#1a1a1a', minWidth: 80 }}>Số lượng:</span>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 30, overflow: 'hidden', backgroundColor: '#fff' }}>
          <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, border: 'none', background: 'transparent', fontSize: '1.2rem', color: '#1a1a1a', cursor: 'pointer' }}>−</button>
          <span style={{ width: 50, textAlign: 'center', fontWeight: 500 }}>{qty}</span>
          <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ width: 40, height: 40, border: 'none', background: 'transparent', fontSize: '1.2rem', color: '#1a1a1a', cursor: 'pointer' }}>+</button>
        </div>
      </div>
      <button onClick={handleAdd} style={{ width: '100%', padding: '1rem', backgroundColor: added ? '#2e7d32' : '#d4af37', color: '#fff', border: 'none', borderRadius: '40px', fontSize: '1rem', fontWeight: 600, fontFamily: '"Montserrat", sans-serif', cursor: 'pointer', transition: 'background 0.3s', boxShadow: '0 4px 12px rgba(212,175,55,0.2)' }}>{added ? '✓ Đã thêm vào giỏ hàng!' : 'Thêm vào giỏ hàng'}</button>
    </div>
  );
}