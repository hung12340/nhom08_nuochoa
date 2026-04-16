'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getOrders,
  Order,
  initializeMockOrders,
} from '@/store/orderStore';
import { getAuthState } from '@/store/authStore';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const authState = getAuthState();
    setIsLoggedIn(authState.isLoggedIn);

    if (!authState.isLoggedIn) {
      setLoading(false);
      return;
    }

    // Initialize mock orders on first load
    initializeMockOrders();

    // Load orders from localStorage
    const loadedOrders = getOrders();
    setOrders(loadedOrders);
    setLoading(false);
  }, []);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getStatusBadgeClass = (status: Order['status']): string => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Đang giao':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Đã hoàn thành':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: Order['status']): string => {
    switch (status) {
      case 'Chờ xác nhận':
        return '⏳';
      case 'Đang giao':
        return '🚚';
      case 'Đã hoàn thành':
        return '✓';
      default:
        return '•';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] text-[#1A1A1A] font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] text-[#1A1A1A] font-sans">
        {/* Hero Section */}
        <div className="bg-[#1A1A1A] text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-5xl md:text-6xl mb-4 tracking-wide">
              Lịch Sử Đơn Hàng
            </h1>
            <p className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">
              Theo dõi mua sắm của bạn
            </p>
          </div>
        </div>

        {/* Login Required Message */}
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-md p-12">
            <div className="text-6xl mb-6">🔐</div>
            <h2 className="font-serif text-2xl mb-4">Vui lòng đăng nhập</h2>
            <p className="text-gray-600 mb-8">
              Bạn cần đăng nhập để xem lịch sử đơn hàng của mình.
            </p>
            <Link
              href="/(auth)"
              className="inline-block bg-[#D4AF37] text-[#1A1A1A] px-8 py-3 font-bold tracking-widest uppercase hover:bg-[#c99e2e] transition-colors mb-4"
            >
              Đăng Nhập
            </Link>
            <div className="border-t border-gray-200 pt-6 mt-6">
              <Link
                href="/"
                className="text-gray-500 hover:text-[#D4AF37] transition-colors uppercase tracking-wider text-sm"
              >
                ← Quay về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#1A1A1A] font-sans">
      {/* Hero Section */}
      <div className="bg-[#1A1A1A] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-6xl mb-4 tracking-wide">
            Lịch Sử Đơn Hàng
          </h1>
          <p className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">
            Theo dõi mua sắm của bạn
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {orders.length === 0 ? (
          <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-md p-12">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="font-serif text-2xl mb-4">Không có đơn hàng nào</h2>
            <p className="text-gray-600 mb-8">
              Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#D4AF37] text-[#1A1A1A] px-8 py-3 font-bold tracking-widest uppercase hover:bg-[#c99e2e] transition-colors mb-4"
            >
              Mua Sắm Ngay
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-[#1A1A1A] text-white p-6">
                  <h2 className="font-serif text-2xl">Các Đơn Hàng</h2>
                  <p className="text-[#D4AF37] text-sm mt-1">
                    Tổng cộng: {orders.length} đơn
                  </p>
                </div>

                <div className="divide-y">
                  {orders.map((order) => (
                    <div
                      key={order.orderId}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedOrder?.orderId === order.orderId
                          ? 'bg-[#D4AF37] bg-opacity-10 border-l-4 border-[#D4AF37]'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-[#1A1A1A]">
                            {order.orderId}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(order.purchaseDate)}
                          </p>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[#D4AF37] mt-3">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="md:col-span-2">
              {selectedOrder ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Header */}
                  <div className="bg-[#1A1A1A] text-white p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-serif text-2xl">
                        Chi Tiết Đơn Hàng
                      </h2>
                      <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold border ${getStatusBadgeClass(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                          Mã Đơn Hàng
                        </p>
                        <p className="text-lg font-semibold text-[#1A1A1A]">
                          {selectedOrder.orderId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                          Ngày Mua
                        </p>
                        <p className="text-lg font-semibold text-[#1A1A1A]">
                          {formatDate(selectedOrder.purchaseDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="font-serif text-xl mb-6 text-[#1A1A1A]">
                      Sản Phẩm
                    </h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-start pb-4 border-b border-gray-100 last:border-0"
                        >
                          <div>
                            <p className="font-semibold text-[#1A1A1A]">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Số lượng: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[#D4AF37]">
                              {formatPrice(item.price)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatPrice(item.price * item.quantity)} tổng
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-6 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <p className="font-serif text-xl text-[#1A1A1A]">
                        Tổng Cộng
                      </p>
                      <p className="text-2xl font-bold text-[#D4AF37]">
                        {formatPrice(selectedOrder.totalAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="p-6 border-t border-gray-200">
                    <h3 className="font-serif text-lg mb-6 text-[#1A1A1A]">
                      Trạng Thái Vận Chuyển
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          status: 'Chờ xác nhận' as const,
                          completed:
                            selectedOrder.status !== 'Chờ xác nhận',
                        },
                        {
                          status: 'Đang giao' as const,
                          completed: selectedOrder.status === 'Đã hoàn thành' ||
                            selectedOrder.status === 'Đang giao',
                        },
                        {
                          status: 'Đã hoàn thành' as const,
                          completed: selectedOrder.status === 'Đã hoàn thành',
                        },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mr-4 ${
                              item.completed ? 'bg-[#D4AF37]' : 'bg-gray-300'
                            }`}
                          >
                            {item.completed ? '✓' : index + 1}
                          </div>
                          <p className={`font-semibold ${
                            item.completed
                              ? 'text-[#1A1A1A]'
                              : 'text-gray-400'
                          }`}>
                            {item.status}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-500 text-lg">
                    Chọn một đơn hàng để xem chi tiết
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-16">
          <Link
            href="/"
            className="inline-block text-gray-600 hover:text-[#D4AF37] transition-colors uppercase tracking-wider font-semibold"
          >
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
