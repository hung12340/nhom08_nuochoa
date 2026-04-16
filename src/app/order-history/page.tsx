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
    const authState = getAuthState();
    setIsLoggedIn(authState.isLoggedIn);

    if (!authState.isLoggedIn) {
      setLoading(false);
      return;
    }

    initializeMockOrders();
    const loadedOrders = getOrders();
    setOrders(loadedOrders);
    if (loadedOrders.length > 0) {
      setSelectedOrder(loadedOrders[0]);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] via-white to-[#F9F9F9] text-[#1A1A1A] font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] via-white to-[#F9F9F9] text-[#1A1A1A] font-sans">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-[#1A1A1A] to-[#2d2d2d] text-white py-28 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="font-serif text-6xl md:text-7xl mb-5 tracking-wide drop-shadow-lg">
              Lịch Sử Đơn Hàng
            </h1>
            <p className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">
              ✨ Theo dõi mua sắm của bạn ✨
            </p>
          </div>
        </div>

        {/* Login Required Message */}
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
            <div className="text-8xl mb-8 animate-bounce">🔐</div>
            <h2 className="font-serif text-3xl mb-5">Vui lòng đăng nhập</h2>
            <p className="text-gray-600 mb-10 text-sm leading-relaxed">
              Bạn cần đăng nhập để xem lịch sử đơn hàng và theo dõi trạng thái vận chuyển.
            </p>
            <Link
              href="/(auth)"
              className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#c99e2e] text-[#1A1A1A] px-8 py-4 font-bold tracking-widest uppercase hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 rounded-lg mb-6"
            >
              🔓 ĐĂNG NHẬP NGAY
            </Link>
            <div className="border-t border-gray-200 pt-8 mt-8">
              <Link
                href="/"
                className="text-gray-500 hover:text-[#D4AF37] transition-colors uppercase tracking-wider text-sm font-semibold"
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
    <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] via-white to-[#F9F9F9] text-[#1A1A1A] font-sans">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#1A1A1A] to-[#2d2d2d] text-white py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-serif text-6xl md:text-7xl mb-5 tracking-wide drop-shadow-lg">
            Lịch Sử Đơn Hàng
          </h1>
          <p className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">
            ✨ Theo dõi mua sắm của bạn ✨
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {orders.length === 0 ? (
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-xl p-16 border border-gray-100">
            <div className="text-8xl mb-8">📦</div>
            <h2 className="font-serif text-3xl mb-5">Không có đơn hàng nào</h2>
            <p className="text-gray-600 mb-10 text-sm leading-relaxed">
              Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm những mùi hương yêu thích của bạn!
            </p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#c99e2e] text-[#1A1A1A] px-8 py-4 font-bold tracking-widest uppercase hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 rounded-lg mb-6"
            >
              ✨ MUA SẮM NGAY
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="md:col-span-1 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 sticky top-20">
                <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2d2d2d] text-white p-8">
                  <h2 className="font-serif text-3xl">Đơn Hàng</h2>
                  <p className="text-[#D4AF37] text-sm mt-2 font-semibold">
                    📦 {orders.length} đơn
                  </p>
                </div>

                <div className="divide-y max-h-[600px] overflow-y-auto">
                  {orders.map((order, idx) => (
                    <div
                      key={order.orderId}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-5 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                        selectedOrder?.orderId === order.orderId
                          ? 'bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 border-l-4 border-[#D4AF37]'
                          : 'hover:border-l-2 hover:border-gray-300'
                      }`}
                      style={{
                        animation: `fade-in 0.5s ease-out ${idx * 0.1}s both`,
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-[#1A1A1A] text-lg">
                            {order.orderId}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(order.purchaseDate)}
                          </p>
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-[#D4AF37]">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="md:col-span-2 animate-fade-in delay-100">
              {selectedOrder ? (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2d2d2d] text-white p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-serif text-3xl">Chi Tiết Đơn</h2>
                        <p className="text-[#D4AF37] text-sm mt-2">Thông tin chi tiết về đơn hàng của bạn</p>
                      </div>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusBadgeClass(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="p-8 border-b border-gray-200 bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-white p-6 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">
                          🏷️ Mã Đơn Hàng
                        </p>
                        <p className="text-2xl font-bold text-[#1A1A1A]">
                          {selectedOrder.orderId}
                        </p>
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">
                          📅 Ngày Đặt Hàng
                        </p>
                        <p className="text-2xl font-bold text-[#1A1A1A]">
                          {formatDate(selectedOrder.purchaseDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-8 border-b border-gray-200">
                    <h3 className="font-serif text-2xl mb-8 text-[#1A1A1A]">
                      🎁 Sản Phẩm
                    </h3>
                    <div className="space-y-6">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-start pb-6 border-b border-gray-100 last:border-0 last:pb-0 bg-white p-5 rounded-xl border border-gray-100"
                        >
                          <div>
                            <p className="font-bold text-[#1A1A1A] text-lg">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              💫 Số lượng: <span className="font-semibold">{item.quantity}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              💰 Giá: <span className="font-semibold">{formatPrice(item.price)}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#D4AF37] text-lg">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Tổng cộng
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-8 bg-gradient-to-br from-[#1A1A1A] to-[#2d2d2d] text-white">
                    <div className="flex justify-between items-center">
                      <p className="font-serif text-2xl">
                        💵 Tổng Cộng
                      </p>
                      <p className="text-4xl font-bold text-[#D4AF37]">
                        {formatPrice(selectedOrder.totalAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="p-8">
                    <h3 className="font-serif text-2xl mb-8 text-[#1A1A1A]">
                      📍 Trạng Thái Vận Chuyển
                    </h3>
                    <div className="space-y-5">
                      {[
                        {
                          status: 'Chờ xác nhận' as const,
                          completed:
                            selectedOrder.status !== 'Chờ xác nhận',
                          icon: '⏳',
                        },
                        {
                          status: 'Đang giao' as const,
                          completed: selectedOrder.status === 'Đã hoàn thành' ||
                            selectedOrder.status === 'Đang giao',
                          icon: '🚚',
                        },
                        {
                          status: 'Đã hoàn thành' as const,
                          completed: selectedOrder.status === 'Đã hoàn thành',
                          icon: '✓',
                        },
                      ].map((item, index) => (
                        <div key={index} className="flex items-start">
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mr-5 transition-all ${
                              item.completed
                                ? 'bg-gradient-to-br from-[#D4AF37] to-[#c99e2e] shadow-lg scale-110'
                                : 'bg-gray-300'
                            }`}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <p className={`font-bold text-lg ${
                              item.completed
                                ? 'text-[#1A1A1A]'
                                : 'text-gray-400'
                            }`}>
                              {item.status}
                            </p>
                            {item.completed && (
                              <p className="text-xs text-green-600 font-semibold mt-1">
                                ✓ Đã hoàn thành
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100">
                  <p className="text-gray-500 text-lg">
                    Chọn một đơn hàng để xem chi tiết
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-20">
          <Link
            href="/"
            className="inline-block text-gray-600 hover:text-[#D4AF37] transition-colors uppercase tracking-wider font-semibold hover:-translate-x-1 duration-300"
          >
            ← Quay về trang chủ
          </Link>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  );
}
