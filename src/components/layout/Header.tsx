"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AccountAvatar from "@/components/ui/AccountAvatar";
import { useCurrentAccount } from "@/hooks/useCurrentAccount";
import { logoutCurrentAccount } from "@/lib/auth";
import { BASE_PATH } from "@/lib/constants";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/nam", label: "Nam" },
  { href: "/nu", label: "Nữ" },
  { href: "/thuong-hieu", label: "Thương hiệu" },
  { href: "/orders", label: "Đơn mua" },
];

const providerLabels = {
  credentials: "Tài khoản",
  google: "Google",
  github: "GitHub",
} as const;

export default function Header() {
  const currentAccount = useCurrentAccount();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutCurrentAccount();
    setIsLoggingOut(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1A1A1A]/6 bg-white/95 font-sans shadow-sm backdrop-blur-sm transition-all duration-300">
      <div className="bg-[#1A1A1A] py-2 text-center text-[10px] font-medium uppercase tracking-widest text-[#D4AF37] md:text-xs">
        Miễn phí vận chuyển toàn quốc cho đơn hàng từ 2.000.000 VNĐ
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex shrink-0 items-center">
            <Link href="/" className="relative block h-17 w-17 transition-opacity hover:opacity-80 md:h-17 md:w-17">
              <Image
                src={`${BASE_PATH}/images/logo.png`}
                alt="Aromis Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </Link>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative text-sm font-medium uppercase tracking-wider text-[#1A1A1A]/74 transition-colors hover:text-[#D4AF37]"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-[#1A1A1A] md:gap-4">
            <button className="transition-colors hover:text-[#D4AF37]">
              <span className="sr-only">Tìm kiếm</span>
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {currentAccount ? (
              <>
                <Link
                  href="/orders"
                  className="hidden items-center gap-3 rounded-full border border-[#1A1A1A]/10 bg-[#FCFBF8] px-2.5 py-1.5 transition hover:border-[#D4AF37] hover:bg-white sm:flex"
                >
                  <AccountAvatar name={currentAccount.displayName} avatarUrl={currentAccount.avatarUrl} size="sm" />
                  <div className="hidden min-w-0 lg:block">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                      {providerLabels[currentAccount.provider]}
                    </p>
                    <p className="max-w-32 truncate text-sm font-semibold text-[#1A1A1A]">
                      {currentAccount.displayName}
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="hidden rounded-full border border-[#1A1A1A]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1A1A1A] transition hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-60 lg:inline-flex"
                >
                  {isLoggingOut ? "Đang đăng xuất" : "Đăng xuất"}
                </button>

                <Link href="/orders" className="sm:hidden">
                  <span className="sr-only">Tài khoản hiện tại</span>
                  <AccountAvatar name={currentAccount.displayName} avatarUrl={currentAccount.avatarUrl} size="sm" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden items-center gap-2 rounded-full border border-[#1A1A1A]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1A1A1A] transition hover:border-[#D4AF37] hover:text-[#D4AF37] sm:inline-flex"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Đăng nhập</span>
                </Link>

                <Link href="/login" className="sm:hidden">
                  <span className="sr-only">Đăng nhập</span>
                  <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              </>
            )}

            <Link href="/cart" className="relative transition-colors hover:text-[#D4AF37]">
              <span className="sr-only">Giỏ hàng</span>
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-white">
                2
              </span>
            </Link>

            <button className="ml-1 transition-colors hover:text-[#D4AF37] md:hidden">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}