"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import products from "@/lib/data.json";

// 1. Tách phần nội dung chính thành một component riêng
function SearchContent() {
  const searchParams = useSearchParams();
  const keywordParam = searchParams.get("keyword") || "";

  const [keyword, setKeyword] = useState(keywordParam);

  useEffect(() => {
    setKeyword(keywordParam);
  }, [keywordParam]);

  const filteredProducts = products.filter((p) => {
    if (!keyword.trim()) return true;

    return p.name.toLowerCase().includes(keyword.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fafafa] to-white px-6 md:px-16 py-14 font-sans">
      {/* HEADER */}
      <div className="text-center mb-12">
        <p className="uppercase tracking-[0.3em] text-xs text-gray-400">
          Aromis Collection
        </p>

        <h1 className="text-4xl md:text-6xl font-serif font-semibold mt-3">
          Khám phá <span className="text-[#D4AF37]">mùi hương</span>
        </h1>

        <p className="text-gray-500 mt-3">
          Tìm kiếm sản phẩm nước hoa bạn yêu thích
        </p>
      </div>

      {/* SEARCH BOX */}
      <div className="max-w-3xl mx-auto mb-16">
        <div className="relative flex items-center bg-white border-2 border-[#D4AF37] rounded-full px-4 py-2 shadow-xl hover:shadow-2xl transition">
          <input
            type="text"
            placeholder="Nhập tên sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 px-4 py-3 bg-white text-black outline-none"
          />

          <div className="ml-2 p-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-white">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* RESULT TITLE */}
      <div className="text-center mb-10">
        <h2 className="text-lg md:text-xl text-gray-600">
          Kết quả cho:{" "}
          <span className="text-[#D4AF37] font-semibold">
            {keyword || "Tất cả sản phẩm"}
          </span>
        </h2>
      </div>

      {/* PRODUCT GRID */}
      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-400 mt-24 italic">
          Không tìm thấy sản phẩm phù hợp 😢
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-300"
            >
              {/* IMAGE */}
              <div className="relative h-72 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
                <Image
                  src={p.images?.[0] || ""}
                  alt={p.name}
                  width={250}
                  height={250}
                  className="object-contain group-hover:scale-110 transition duration-500"
                />

                <Link
                  href={`/products/${p.id}`}
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-end justify-center pb-4"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition text-white bg-black/80 px-4 py-2 rounded-full text-sm">
                    Xem chi tiết
                  </span>
                </Link>
              </div>

              {/* INFO */}
              <div className="p-5 flex flex-col gap-2">
                <Link
                  href={`/products/${p.id}`}
                  className="font-semibold text-gray-800 group-hover:text-[#D4AF37] transition"
                >
                  {p.name}
                </Link>

                <p className="text-sm text-gray-400">{p.brand}</p>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-[#D4AF37] font-bold text-lg">
                    {Number(p.price).toLocaleString()}đ
                  </span>

                  <span className="text-xs px-3 py-1 bg-gray-100 text-gray-500 rounded-full">
                    Luxury
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Đang tải kết quả tìm kiếm...</div>}>
      <SearchContent />
    </Suspense>
  );
}
