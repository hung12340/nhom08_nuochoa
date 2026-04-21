"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import users from "@/lib/users.json";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState("");
  const router = useRouter();
  
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      login(user);
      router.push("/");
    } else {
      setError("Email hoặc mật khẩu không chính xác!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-[#1A1A1A] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Đăng Nhập
          </h1>
          <p className="text-gray-500 font-sans" style={{ fontFamily: 'var(--font-montserrat)' }}>
            Chào mừng bạn quay lại với Aromis Perfume
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} 
                required
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Nút con mắt */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#D4AF37] hover:bg-[#b8952e] text-white font-bold py-3 rounded-md transition-colors duration-300 uppercase tracking-widest text-sm"
          >
            Đăng nhập ngay
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 font-sans" style={{ fontFamily: 'var(--font-montserrat)' }}>
            Chưa có tài khoản?{" "}
            <Link 
              href="/register" 
              className="text-[#D4AF37] font-semibold hover:underline transition-all"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}