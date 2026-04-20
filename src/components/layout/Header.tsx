"use client";

import Link from 'next/link';
import Image from 'next/image';
import { BASE_PATH } from '@/lib/constants';
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function Header() {
  const { totalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm font-sans transition-all duration-300">
      <div className="bg-[#1A1A1A] text-[#D4AF37] text-[10px] md:text-xs py-2 text-center tracking-widest uppercase font-medium">
        Miễn phí vận chuyển toàn quốc cho đơn hàng từ 2.000.000 VNĐ
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="relative block w-17 h-17 md:w-17 md:h-17 hover:opacity-80 transition-opacity">
              <Image 
                src={`${BASE_PATH}/images/logo.png`}
                alt="Aromis Logo"
                fill
                priority
                className="object-contain object-left" 
              />
            </Link>
          </div>

          <nav className="hidden md:flex space-x-10">
            <Link href="/" className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative group">
              Trang chủ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/nam" className="text-sm font-medium text-gray-500 uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative group">
              Nam
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/nu" className="text-sm font-medium text-gray-500 uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative group">
              Nữ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/thuong-hieu" className="text-sm font-medium text-gray-500 uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative group">
              Thương Hiệu
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="flex items-center space-x-5 md:space-x-6 text-[#1A1A1A]">
            
            {/* SEARCH */}
            <button className="hover:text-[#D4AF37] transition-colors">
              <span className="sr-only">Tìm kiếm</span>
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            
            {/* ACCOUNT */}
            <button className="hover:text-[#D4AF37] transition-colors hidden sm:block">
              <span className="sr-only">Tài khoản</span>
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </button>

            {/* CART */}
            <Link href="/cart" className="hover:text-[#D4AF37] transition-colors relative">
              <span className="sr-only">Giỏ hàng</span>
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>

              {/* 👉 BADGE ĐỘNG (FIX HYDRATION) */}
              {mounted && totalItems() > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#D4AF37] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems()}
                </span>
              )}
            </Link>

            {/* MENU MOBILE */}
            <button className="md:hidden hover:text-[#D4AF37] transition-colors ml-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}