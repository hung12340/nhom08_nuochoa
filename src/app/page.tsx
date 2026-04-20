"use client";

import Link from "next/link";
import Image from "next/image";
import products from "@/lib/data.json";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const recentProducts = products.slice(0, 4);

  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (!search.trim()) return;
    router.push(`/search?keyword=${search}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9] text-[#1A1A1A] font-sans">
      
      <section className="relative h-[85vh] flex items-center justify-center bg-[#1A1A1A] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://orchard.vn/wp-content/uploads/2023/08/maison-francis-kurkdjian-baccarat-rouge-540-extrait-de-parfum_7.jpg"
            alt="Nước hoa cao cấp"
            fill 
            className="object-cover" 
            priority
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-[#D4AF37] tracking-[0.3em] uppercase text-sm font-semibold mb-4 block">
            Aromis
          </span>

          <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight text-white">
            Đẳng cấp đến từ sự chân thực
          </h1>

          <p className="text-lg text-gray-200 mb-8 max-w-xl font-light">
            Bộ sưu tập nước hoa cao cấp được tuyển chọn kỹ lưỡng từ những thương hiệu hàng đầu thế giới.
          </p>

          {/* ✅ SEARCH (THÊM NHẸ - KHÔNG PHÁ UI) */}
          <div className="flex w-full max-w-md mb-6">
            <input
              type="text"
              placeholder="Tìm nước hoa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-4 py-3 text-black outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-[#D4AF37] px-5 text-[#1A1A1A] font-bold hover:bg-white transition"
            >
              🔍
            </button>
          </div>

          <Link
            href="/products"
            className="bg-[#D4AF37] text-[#1A1A1A] px-10 py-4 rounded-none font-bold tracking-widest hover:bg-white transition-all duration-300"
          >
            MUA SẮM NGAY
          </Link>
        </div>
      </section>

      {/* PHẦN DƯỚI GIỮ NGUYÊN */}
      <section className="py-24 bg-[#F9F9F9]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif text-[#1A1A1A] mb-12">Bộ Sưu Tập</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="group relative h-[500px] overflow-hidden bg-gray-200">
               <Image 
                src="https://orchard.vn/wp-content/uploads/2018/06/chanel-bleu-de-chanel-parfum_4.jpg" 
                alt="Nam" 
                fill 
                className="object-cover transition duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#1A1A1A]/20 flex flex-col items-center justify-center transition duration-500 group-hover:bg-[#1A1A1A]/50">
                <h3 className="text-white text-3xl font-serif tracking-widest border-b-2 border-[#D4AF37] pb-2">PHÁI MẠNH</h3>
              </div>
            </div>

            <div className="group relative h-[500px] overflow-hidden bg-gray-200">
              <Image 
                src="https://orchard.vn/wp-content/uploads/2023/08/parfums-de-marly-delina_3.jpg" 
                alt="Nữ" 
                fill 
                className="object-cover transition duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#1A1A1A]/20 flex flex-col items-center justify-center transition duration-500 group-hover:bg-[#1A1A1A]/50">
                <h3 className="text-white text-3xl font-serif tracking-widest border-b-2 border-[#D4AF37] pb-2">PHÁI ĐẸP</h3>
              </div>
            </div>

            <div className="group relative h-[500px] overflow-hidden bg-gray-200">
              <Image 
                src="https://orchard.vn/wp-content/uploads/2023/08/maison-francis-kurkdjian-baccarat-rouge-540-extrait-de-parfum_8.jpg" 
                alt="Unisex" 
                fill 
                className="object-cover transition duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#1A1A1A]/20 flex flex-col items-center justify-center transition duration-500 group-hover:bg-[#1A1A1A]/50">
                <h3 className="text-white text-3xl font-serif tracking-widest border-b-2 border-[#D4AF37] pb-2">UNISEX</h3>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-[#1A1A1A] mb-4">Hương Thơm Mới Nhất</h2>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {recentProducts.map((p) => (
              <div key={p.id} className="group text-center flex flex-col h-full">
                <div className="relative h-96 mb-6 overflow-hidden bg-[#F9F9F9] border border-gray-100">
                  {p.images && p.images.length > 0 ? (
                    <Image 
                      src={p.images[0]} 
                      alt={p.name} 
                      fill 
                      className="object-contain p-4 transition duration-700 group-hover:scale-105" 
                    />
                  ) : (
                     <div className="flex h-full items-center justify-center text-gray-300 font-serif italic">No image</div>
                  )}
                  
                  <Link 
                    href={`/products/${p.id}`} 
                    className="absolute bottom-0 left-0 right-0 bg-[#1A1A1A] text-white py-4 translate-y-full group-hover:translate-y-0 transition duration-300 font-medium tracking-widest text-sm uppercase z-10"
                  >
                    Xem chi tiết
                  </Link>
                </div>

                <Link href={`/products/${p.id}`} className="text-xl font-serif text-[#1A1A1A] hover:text-[#D4AF37] transition mb-2">
                  {p.name}
                </Link>
                <p className="text-gray-500 mb-4 text-sm font-light uppercase tracking-wider">{p.brand}</p>
                <p className="text-[#D4AF37] font-semibold mt-auto text-lg">
                  {Number(p.price).toLocaleString()} VNĐ
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}