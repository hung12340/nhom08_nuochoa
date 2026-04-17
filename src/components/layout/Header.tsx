import Link from 'next/link';
import Image from 'next/image';
import { BASE_PATH } from '@/lib/constants';

export default function Header() {
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
            <Link href="/" className="text-sm font-semibold text-amber-900 uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative group">
              Trang chủ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/products?gender=nam" className="text-sm font-medium text-gray-600 uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative group">
              Nam
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/products?gender=nu" className="text-sm font-medium text-gray-600 uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative group">
              Nữ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/brands" className="text-sm font-medium text-gray-600 uppercase tracking-wider hover:text-[#D4AF37] transition-colors relative group">
              Thương Hiệu
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4 md:space-x-6 text-amber-900">
            <Link 
              href="/order-history" 
              className="text-sm font-medium text-gray-600 hover:text-[#D4AF37] transition-colors"
            >
              Lịch sử đơn hàng
            </Link>
            
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
            >
              Đăng Nhập
            </Link>

            <Link 
              href="/register" 
              className="px-4 py-2 text-sm font-semibold text-amber-600 border-2 border-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            >
              Đăng Ký
            </Link>

            <button className="md:hidden hover:text-amber-600 transition-colors">
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