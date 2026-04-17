'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div>
      <div className="relative h-100 md:h-125 w-full bg-gray-100 rounded-lg overflow-hidden mb-4">
        <Image
          src={images[selectedImage]}
          alt={name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative w-20 h-20 shrink-0 border-2 rounded-md overflow-hidden ${
                selectedImage === idx ? 'border-gold' : 'border-transparent'
              }`}
            >
              <Image src={img} alt={`${name} thumbnail ${idx+1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}