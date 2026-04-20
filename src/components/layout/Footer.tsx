"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { BASE_PATH } from '@/lib/constants';

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!email.trim()) return; 
    setIsSubscribed(true);
  };

const socialLinks = [
  { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>, 
    href: "https://www.facebook.com/", 
    label: "Facebook" 
  },
  { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.71.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>, 
    href: "https://www.youtube.com/", 
    label: "Youtube" 
  },
  { 
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>, 
    href: "https://github.com/hung12340/nhom08_nuochoa", 
    label: "Github" 
  },
];

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
                priority 
                className="object-contain"
              />
            </Link>
            
            <p className="text-gray-400 font-light leading-relaxed mb-6">
              Đẳng cấp đến từ sự chân thực. <br/> Chúng tôi mang đến những hương thơm độc quyền, giúp bạn lưu giữ dấu ấn cá nhân trong từng khoảnh khắc.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 border border-gray-600 flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 rounded-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-serif text-white mb-6 uppercase tracking-widest">Khám phá</h4>
            <ul className="space-y-4 font-light text-gray-400">
              <li><Link href="/" className="hover:text-[#D4AF37] transition-colors">Trang chủ</Link></li>
              <li><Link href="/products" className="hover:text-[#D4AF37] transition-colors">Tất cả sản phẩm</Link></li>
              <li><Link href="/products?gender=Nam" className="hover:text-[#D4AF37] transition-colors">Nước hoa Nam</Link></li>
              <li><Link href="/products?gender=Nữ" className="hover:text-[#D4AF37] transition-colors">Nước hoa Nữ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif text-white mb-6 uppercase tracking-widest">Hỗ trợ</h4>
            <ul className="space-y-4 font-light text-gray-400">
              <li><Link href="/gioi-thieu" className="hover:text-[#D4AF37] transition-colors">Về Aromis</Link></li>
              <li><Link href="/contact" className="hover:text-[#D4AF37] transition-colors">Liên hệ</Link></li>
              <li><Link href="/blog" className="hover:text-[#D4AF37] transition-colors">Cẩm nang nước hoa</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif text-white mb-6 uppercase tracking-widest">Bản tin Aromis</h4>
            <p className="text-gray-400 font-light mb-4">
              Đăng ký để nhận ưu đãi độc quyền và thông tin về những mùi hương mới nhất.
            </p>
            
            {isSubscribed ? (
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37] p-4 mt-2 rounded-sm transform transition-all duration-500 ease-out">
                <p className="text-[#D4AF37] font-medium text-sm flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>Đã đăng ký nhận tin thành công <br/> Cảm ơn Quý khách</span>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col space-y-3 mt-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email của bạn..." 
                  className="bg-transparent border-b border-gray-600 py-2 px-1 text-white focus:outline-none focus:border-[#D4AF37] transition-colors font-light placeholder-gray-500"
                />
                <button 
                  type="submit"
                  className="bg-[#D4AF37] text-[#1A1A1A] py-3 uppercase tracking-widest font-semibold hover:bg-white transition-colors mt-2 text-sm disabled:opacity-50"
                >
                  Đăng ký
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center md:flex md:justify-between md:text-left text-sm font-light text-gray-500">
          <p>&copy; 2026 Aromis Perfume. Dựa trên dự án nhóm 8 HCMUTE.</p>
        </div>
      </div>
    </footer>
  );
}