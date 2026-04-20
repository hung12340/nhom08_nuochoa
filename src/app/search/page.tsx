"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import products from "@/lib/data.json";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const keywordParam = searchParams.get("keyword") || "";
  const [keyword, setKeyword] = useState(keywordParam);

  // cập nhật khi URL thay đổi
  useEffect(() => {
    setKeyword(keywordParam);
  }, [keywordParam]);

  // xử lý search
  const handleSearch = () => {
    if (!keyword.trim()) return;
    router.push(`/search?keyword=${keyword}`);
  };

  // lọc sản phẩm
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(keyword.toLowerCase()) ||
    p.brand.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9F9F9] px-6 md:px-16 py-12">

      {/* 🔥 SEARCH BOX */}
      <div className="max-w-xl mx-auto mb-10 flex">
        <input
          type="text"
          placeholder="Tìm nước hoa..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 px-4 py-3 border outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-[#D4AF37] px-6 font-bold hover:bg-black hover:text-white transition"
        >
          🔍
        </button>
      </div>

      {/* TITLE */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-serif">
          Kết quả cho: <span className="text-[#D4AF37]">{keyword}</span>
        </h1>
      </div>

      {/* RESULT */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          Không tìm thấy sản phẩm.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {filteredProducts.map((p) => (
            <div key={p.id} className="group text-center flex flex-col h-full">
              
              <div className="relative h-80 mb-4 bg-white border overflow-hidden">
                <Image
                  src={p.images?.[0] || ""}
                  alt={p.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition"
                />

                <Link
                  href={`/products/${p.id}`}
                  className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 translate-y-full group-hover:translate-y-0 transition"
                >
                  Xem chi tiết
                </Link>
              </div>

              <Link href={`/products/${p.id}`} className="hover:text-[#D4AF37]">
                {p.name}
              </Link>

              <p className="text-gray-500 text-sm">{p.brand}</p>

              <p className="text-[#D4AF37] font-semibold mt-auto">
                {Number(p.price).toLocaleString()} VNĐ
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}