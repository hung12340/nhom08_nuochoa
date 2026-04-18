'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          border: '1px solid rgba(212,175,55,0.1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(212,175,55,0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
        }}
      >
        {/* Ảnh sản phẩm */}
        <div style={{ position: 'relative', aspectRatio: '1/1', backgroundColor: '#fafafa' }}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div
          style={{
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <p
            style={{
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#888',
              marginBottom: '0.25rem',
            }}
          >
            {product.brand}
          </p>
          <h3
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1a1a1a',
              margin: '0 0 0.5rem 0',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              wordBreak: 'break-word',
            }}
          >
            {product.name}
          </h3>
          <p
            style={{
              fontWeight: 600,
              color: '#d4af37',
              marginTop: 'auto',
              marginBottom: 0,
            }}
          >
            {product.price.toLocaleString('vi-VN')} ₫
          </p>
        </div>
      </div>
    </Link>
  );
}