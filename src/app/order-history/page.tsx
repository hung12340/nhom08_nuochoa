'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthState } from '@/store/authStore';
import { getOrders, initializeMockOrders } from '@/store/orderStore';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  purchaseDate: string;
  status: 'Chờ xác nhận' | 'Đang giao' | 'Đã hoàn thành';
  totalAmount: number;
  items: OrderItem[];
}

export default function OrderHistoryPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authState = getAuthState();
    if (!authState.isLoggedIn) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);
    initializeMockOrders();
    const allOrders = getOrders();
    setOrders(allOrders);

    if (allOrders.length > 0) {
      setSelectedOrderId(allOrders[0].orderId);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Vui Lòng Đăng Nhập
          </h1>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để xem lịch sử đơn hàng của mình
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
          >
            Đăng Nhập Ngay
          </button>
        </div>
      </div>
    );
  }

  const selectedOrder = orders.find((o) => o.orderId === selectedOrderId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Đang giao':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Đã hoàn thành':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .stagger {
          animation: fadeIn 0.6s ease-out backwards;
        }
      `}</style>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold font-serif mb-2">
            Lịch Sử Đơn Hàng
          </h1>
          <p className="text-amber-100">Theo dõi các đơn hàng của bạn</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Chưa có đơn hàng
            </h2>
            <p className="text-gray-600">
              Bạn chưa tạo bất kỳ đơn hàng nào. Hãy bắt đầu mua sắm ngay!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order List */}
            <div className="fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Đơn Hàng ({orders.length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {orders.map((order, index) => (
                  <div
                    key={order.orderId}
                    onClick={() => setSelectedOrderId(order.orderId)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    className={`stagger cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedOrderId === order.orderId
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-900">
                          {order.orderId}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.purchaseDate).toLocaleDateString(
                            'vi-VN'
                          )}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-amber-600 font-semibold mt-2">
                      {order.totalAmount.toLocaleString('vi-VN')} ₫
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details */}
            {selectedOrder && (
              <div className="fade-in lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Chi Tiết Đơn Hàng
                  </h2>

                  {/* Order Info */}
                  <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã đơn:</span>
                      <span className="font-semibold text-gray-900">
                        {selectedOrder.orderId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày mua:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(
                          selectedOrder.purchaseDate
                        ).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Sản Phẩm
                  </h3>
                  <div className="space-y-3 mb-8 pb-8 border-b border-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        className="stagger flex justify-between items-center bg-gray-50 p-4 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            x{item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-amber-600">
                          {(item.price * item.quantity).toLocaleString(
                            'vi-VN'
                          )}{' '}
                          ₫
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-200">
                    <span className="text-lg font-bold text-gray-900">
                      Tổng cộng
                    </span>
                    <span className="text-2xl font-bold text-amber-600">
                      {selectedOrder.totalAmount.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>

                  {/* Status Timeline */}
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Trạng Thái Đơn Hàng
                  </h3>
                  <div className="space-y-4">
                    {['Chờ xác nhận', 'Đang giao', 'Đã hoàn thành'].map(
                      (status, index) => {
                        const isCompleted =
                          (selectedOrder.status === 'Chờ xác nhận' &&
                            index === 0) ||
                          (selectedOrder.status === 'Đang giao' &&
                            index <= 1) ||
                          selectedOrder.status === 'Đã hoàn thành';

                        const isCurrent = selectedOrder.status === status;

                        return (
                          <div key={status} className="flex items-start">
                            <div
                              className={`flex-shrink-0 mr-4 ${
                                isCompleted
                                  ? 'transform scale-110'
                                  : ''
                              }`}
                            >
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                                  isCompleted
                                    ? 'bg-green-100 text-green-600'
                                    : isCurrent
                                      ? 'bg-amber-100 text-amber-600 animate-pulse'
                                      : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {isCompleted ? '✓' : getStatusIcon(status)}
                              </div>
                            </div>
                            <div className="flex-grow">
                              <p
                                className={`font-semibold ${
                                  isCompleted
                                    ? 'text-green-600'
                                    : isCurrent
                                      ? 'text-amber-600'
                                      : 'text-gray-400'
                                }`}
                              >
                                {status}
                              </p>
                              <p className="text-sm text-gray-600">
                                {isCompleted
                                  ? 'Hoàn tất'
                                  : isCurrent
                                    ? 'Hiện tại'
                                    : 'Đang chờ'}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
