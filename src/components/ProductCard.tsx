import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden group">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-64 w-full bg-gray-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="font-serif text-lg font-medium text-dark truncate">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-2">{product.brand}</p>
          <p className="text-gold font-semibold">
            {product.price.toLocaleString('vi-VN')} ₫
          </p>
          <p className="text-sm text-gray-400 mt-1">{product.volume}</p>
        </div>
      </Link>
    </div>
  );
}