"use client";

import Link from "next/link";

export default function ProductCard({ product }: any) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition cursor-pointer">

        {/* IMAGE */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-60 object-cover rounded-xl"
        />

        {/* INFO */}
        <h2 className="mt-3 font-semibold text-lg line-clamp-1">
          {product.name}
        </h2>

        <p className="text-gray-500 text-sm">
          {product.brand}
        </p>

        <p className="text-[#D4AF37] font-bold mt-2">
          {product.price.toLocaleString()}đ
        </p>

      </div>
    </Link>
  );
}