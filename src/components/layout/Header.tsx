"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE_PATH } from "@/lib/constants";
import { getAllProducts } from "@/lib/products";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function Header() {
  const allProducts = getAllProducts();
  const brands = Array.from(new Set(allProducts.map((p) => p.brand)));

  const totalItems = useCartStore((state) => state.totalItems());
  
  const { isLoggedIn, user, logout } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm font-sans transition-all duration-300">
      {/* TOP BAR */}
      <div className="bg-[#1A1A1A] text-[#D4AF37] text-[10px] md:text-xs py-2 text-center tracking-widest uppercase font-medium">
        CỬA HÀNG NƯỚC HOA CHÍNH HÃNG - AROMIS
      </div>

      {/* MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="relative block w-16 h-16 hover:opacity-80 transition-opacity"
            >
              <Image
                src={`${BASE_PATH}/images/logo.png`}
                alt="Aromis Logo"
                fill
                priority
                className="object-contain"
              />
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex space-x-10 items-center">
            <Link
              href="/"
              className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative group"
            >
              Trang chủ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              href="/products?gender=Nam"
              className="text-sm font-medium text-gray-500 uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative group"
            >
              Nam
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              href="/products?gender=Nữ"
              className="text-sm font-medium text-gray-500 uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative group"
            >
              Nữ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              href="/products?gender=Unisex"
              className="text-sm font-medium text-gray-500 uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative group"
            >
              Unisex
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* BRAND MENU */}
            <div className="relative group">
              <Link
                href="/products"
                className="flex items-center gap-1 text-sm font-medium text-gray-500 uppercase tracking-wider hover:text-[#D4AF37] transition-colors py-2"
              >
                Thương Hiệu
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Link>

              <div className="absolute top-full left-0 w-48 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="bg-white shadow-lg border border-gray-100 rounded-md py-2 max-h-80 overflow-y-auto">
                  {brands.map((brand) => (
                    <Link
                      key={brand}
                      href={`/products?brand=${encodeURIComponent(brand)}`}
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-[#D4AF37] hover:bg-gray-50 transition-colors"
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* RIGHT ICONS */}
          <div className="flex items-center space-x-5 md:space-x-6 text-[#1A1A1A]">
            {/* SEARCH */}
            <button
              onClick={() => router.push("/search")}
              className="hover:text-[#D4AF37] transition-colors"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* ACCOUNT / USER PROFILE */}
            {mounted && (
              isLoggedIn && user ? (
                // Hiển thị khi đã đăng nhập
                <div className="relative group hidden sm:block">
                  <div className="flex items-center gap-2 cursor-pointer py-2">
                    <div className="relative w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border border-gray-200">
                      <Image
                        src={user.avatar || `${BASE_PATH}/images/default-avatar.png`}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-colors hidden lg:block">
                      {user.name}
                    </span>
                  </div>

                  {/* Dropdown User Menu */}
                  <div className="absolute right-0 top-full mt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-white shadow-lg border border-gray-100 rounded-md py-2">
                      <div className="px-4 py-2 border-b border-gray-50 lg:hidden block">
                         <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                      </div>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-600 hover:text-[#D4AF37] hover:bg-gray-50 transition-colors sm:hidden">
                        Đơn hàng của tôi
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Hiển thị khi chưa đăng nhập
                <Link href="/login" className="hover:text-[#D4AF37] transition-colors hidden sm:block">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>
              )
            )}

            {/* ORDERS (Chỉ hiển thị khi đã đăng nhập) */}
            {mounted && isLoggedIn && (
              <Link
                href="/orders"
                className="hover:text-[#D4AF37] transition-colors relative"
                title="Đơn hàng của tôi"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </Link>
            )}

            {/* CART */}
            <Link
              href="/cart"
              className="hover:text-[#D4AF37] transition-colors relative"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>

              {mounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#D4AF37] text-white text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* MOBILE MENU */}
            <button className="md:hidden hover:text-[#D4AF37] transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}