import Link from 'next/link';
import Image from 'next/image';
import { BASE_PATH } from '@/lib/constants';
import { getAllProducts } from '@/lib/products';

export default function Header() {
  const allProducts = getAllProducts();
  const brands = Array.from(new Set(allProducts.map(p => p.brand)));

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm font-sans transition-all duration-300">
      <div className="bg-[#1A1A1A] text-[#D4AF37] text-[10px] md:text-xs py-2 text-center tracking-widest uppercase font-medium">
        CỬA HÀNG NƯỚC HOA CHÍNH HÃNG - AROMIS
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
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

          <nav className="hidden md:flex space-x-10 items-center">
            <Link href="/" className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative group">
              Trang chủ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <Link href="/products?gender=Nam" className="text-sm font-medium text-gray-500 uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative group">
              Nam
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <Link href="/products?gender=Nữ" className="text-sm font-medium text-gray-500 uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative group">
              Nữ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <Link href="/products?gender=Unisex" className="text-sm font-medium text-gray-500 uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative group">
              Unisex
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <div className="relative group">
              <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-gray-500 uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative py-2">
                Thương Hiệu
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <div className="absolute top-full left-0 w-48 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="bg-white shadow-lg border border-gray-100 rounded-md py-2 flex flex-col max-h-80 overflow-y-auto">
                  {brands.map((brand) => (
                    <Link 
                      key={brand} 
                      href={`/products?brand=${encodeURIComponent(brand)}`}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-[#D4AF37] hover:bg-gray-50 transition-colors"
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
          </nav>

          <div className="flex items-center space-x-5 md:space-x-6 text-[#1A1A1A]">
            <button className="hover:text-[#D4AF37] transition-colors">
              <span className="sr-only">Tìm kiếm</span>
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            
            <button className="hover:text-[#D4AF37] transition-colors hidden sm:block">
              <span className="sr-only">Tài khoản</span>
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </button>

            <Link href="/cart" className="hover:text-[#D4AF37] transition-colors relative">
              <span className="sr-only">Giỏ hàng</span>
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span className="absolute -top-1.5 -right-2 bg-[#D4AF37] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </Link>

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