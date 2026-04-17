'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="p-4">
      {/* Ảnh chính */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
        <Image
          src={images[selectedImage]}
          alt={name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 600px"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden transition-all duration-200 snap-start ${
                selectedImage === idx
                  ? 'ring-2 ring-[#D4AF37] ring-offset-2'
                  : 'ring-1 ring-gray-200 hover:ring-[#D4AF37]/50'
              }`}
            >
              <Image
                src={img}
                alt={`${name} - ảnh ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}