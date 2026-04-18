'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Ảnh chính chất lượng cao */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '1 / 1',
          width: '100%',
          backgroundColor: '#fafafa',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(212, 175, 55, 0.15)',
        }}
      >
        <Image
          src={images[selectedIndex]}
          alt={`${name} - ảnh chính`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 600px"
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              style={{
                position: 'relative',
                width: '70px',
                height: '70px',
                backgroundColor: '#fafafa',
                borderRadius: '12px',
                overflow: 'hidden',
                border: idx === selectedIndex ? '2px solid #d4af37' : '1px solid rgba(0,0,0,0.08)',
                cursor: 'pointer',
                padding: 0,
                transition: 'transform 0.1s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Image
                src={img}
                alt={`${name} - thumbnail ${idx + 1}`}
                fill
                sizes="70px"
                style={{ objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}