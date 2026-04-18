// src/components/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ position: 'relative', aspectRatio: '1/1' }}>
          <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} />
        </div>
        <div style={{ padding: 16 }}>
          <p style={{ fontFamily: 'Montserrat', fontSize: 12, color: '#666' }}>{product.brand}</p>
          <h3 style={{ fontFamily: 'Playfair Display', fontSize: 18, color: '#1A1A1A' }}>{product.name}</h3>
          <p style={{ fontFamily: 'Montserrat', fontWeight: 600, color: '#D4AF37' }}>{product.price.toLocaleString('vi-VN')} ₫</p>
        </div>
      </div>
    </Link>
  );
}