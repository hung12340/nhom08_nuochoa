"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import ordersData from "@/lib/orders.json";

export default function OrdersPage() {
  const { isLoggedIn, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // GIAO DIỆN KHI CHƯA ĐĂNG NHẬP
  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F9F9F9] px-4">
        <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-100 text-center max-w-md w-full">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-2xl font-serif text-[#1A1A1A] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
            Yêu cầu đăng nhập
          </h2>
          <p className="text-gray-500 mb-6 text-sm" style={{ fontFamily: 'var(--font-montserrat)' }}>
            Vui lòng đăng nhập để xem lịch sử đơn hàng và theo dõi trạng thái vận chuyển của bạn tại Aromis
          </p>
          <Link
            href="/login"
            className="inline-block w-full bg-[#D4AF37] hover:bg-[#b8952e] text-white font-bold py-3 rounded-md transition-colors duration-300 uppercase tracking-widest text-sm"
          >
            Đến trang đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  // Lọc đơn hàng
  const userOrders = ordersData.filter((order) => order.userEmail === user?.email);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã giao": return "bg-green-100 text-green-700";
      case "Đang xử lý": return "bg-blue-100 text-blue-700";
      case "Đã hủy": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP
  return (
    <div className="min-h-screen bg-[#F9F9F9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 border-b border-gray-200 pb-5">
          <h1 className="text-3xl font-serif text-[#1A1A1A]" style={{ fontFamily: 'var(--font-playfair)' }}>
            Lịch sử đơn hàng
          </h1>
          <p className="text-gray-500 mt-2 text-sm" style={{ fontFamily: 'var(--font-montserrat)' }}>
            Xin chào <span className="font-semibold text-[#1A1A1A]">{user?.name}</span>, dưới đây là các đơn hàng bạn đã đặt
          </p>
        </div>

        {userOrders.length === 0 ? (
          <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
            <Link href="/products" className="text-[#D4AF37] hover:underline font-medium">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Mã đơn hàng: <span className="text-[#1A1A1A] font-bold">{order.id}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Ngày đặt: {order.date}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-bold text-[#D4AF37]">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
                    </p>
                    <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Danh sách sản phẩm trong đơn hàng */}
                <div className="px-6 py-2">
                  <ul className="divide-y divide-gray-100">
                    {order.items.map((item, index) => (
                      <li key={index} className="py-4 flex justify-between items-center">
                        <div className="flex items-center">
                          {/* Khung chứa hình ảnh sản phẩm */}
                          <div className="relative w-16 h-16 bg-gray-50 rounded-md overflow-hidden border border-gray-100 mr-4 shrink-0">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-contain p-1" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1A1A1A]">{item.name}</p>
                            <p className="text-sm text-gray-500 mt-0.5">Số lượng: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-[#1A1A1A]">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}