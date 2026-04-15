import Link from "next/link";
import Image from "next/image"; 
import { BASE_PATH } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#F9F9F9] pt-16 pb-8 font-sans border-t border-[#D4AF37]/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="flex flex-col items-start">
            <Link href="/" className="mb-6 inline-block">
              <Image 
                src={`${BASE_PATH}/images/logo.png`}
                alt="Aromis Perfume Logo"
                width={125} 
                height={125} 
                priority // Ưu tiên load ảnh này
              />
            </Link>
            
            <p className="text-gray-400 font-light leading-relaxed mb-6">
              Đẳng cấp đến từ sự chân thực. <br/> Chúng tôi mang đến những hương thơm độc quyền, giúp bạn lưu giữ dấu ấn cá nhân trong từng khoảnh khắc.
            </p>
            <div className="flex space-x-4">
              {['F', 'I', 'Y'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="w-10 h-10 border border-gray-600 flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-serif text-white mb-6 uppercase tracking-widest">Khám phá</h4>
            <ul className="space-y-4 font-light text-gray-400">
              <li><Link href="/" className="hover:text-[#D4AF37] transition-colors">Trang chủ</Link></li>
              <li><Link href="/products" className="hover:text-[#D4AF37] transition-colors">Tất cả sản phẩm</Link></li>
              <li><Link href="/products?category=Nam" className="hover:text-[#D4AF37] transition-colors">Nước hoa Nam</Link></li>
              <li><Link href="/products?category=Nữ" className="hover:text-[#D4AF37] transition-colors">Nước hoa Nữ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif text-white mb-6 uppercase tracking-widest">Hỗ trợ</h4>
            <ul className="space-y-4 font-light text-gray-400">
              <li><Link href="/about" className="hover:text-[#D4AF37] transition-colors">Về Aromis</Link></li>
              <li><Link href="/contact" className="hover:text-[#D4AF37] transition-colors">Liên hệ</Link></li>
              <li><Link href="/faq" className="hover:text-[#D4AF37] transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link href="/policy" className="hover:text-[#D4AF37] transition-colors">Chính sách đổi trả</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif text-white mb-6 uppercase tracking-widest">Bản tin Aromis</h4>
            <p className="text-gray-400 font-light mb-4">
              Đăng ký để nhận ưu đãi độc quyền và thông tin về những mùi hương mới nhất.
            </p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Email của bạn..." 
                className="bg-transparent border-b border-gray-600 py-2 px-1 text-white focus:outline-none focus:border-[#D4AF37] transition-colors font-light placeholder-gray-500"
              />
              <button 
                type="button"
                className="bg-[#D4AF37] text-[#1A1A1A] py-3 uppercase tracking-widest font-semibold hover:bg-white transition-colors mt-2 text-sm"
              >
                Đăng ký
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center md:flex md:justify-between md:text-left text-sm font-light text-gray-500">
          <p>&copy; 2026 Aromis Perfume. Dựa trên dự án Nhom08 HCMUTE.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <a href="#" className="hover:text-white transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-white transition-colors">Bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}