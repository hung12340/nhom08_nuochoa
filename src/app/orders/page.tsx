"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  STORAGE_EVENT_NAME,
  clearCurrentUserEmail,
  getCurrentUserEmail,
  getOrderHistory,
  OrderHistory,
  resetOrderHistory,
} from "@/lib/clientStorage";

function subscribeToBrowserStore(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT_NAME, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT_NAME, onStoreChange);
  };
}

const statusClasses: Record<OrderHistory["status"], string> = {
  "Chờ xác nhận": "border-amber-200 bg-amber-50 text-amber-700",
  "Đang chuẩn bị": "border-sky-200 bg-sky-50 text-sky-700",
  "Đang giao": "border-violet-200 bg-violet-50 text-violet-700",
  "Đã hoàn thành": "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateString}T12:00:00`));
}

function sortOrders(orders: OrderHistory[]) {
  return [...orders].sort(
    (left, right) =>
      new Date(`${right.purchaseDate}T12:00:00`).getTime() - new Date(`${left.purchaseDate}T12:00:00`).getTime()
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [expandedOrderId, setExpandedOrderId] = useState("");
  const userEmail = useSyncExternalStore(subscribeToBrowserStore, getCurrentUserEmail, () => "");
  const ordersSnapshot = useSyncExternalStore(
    subscribeToBrowserStore,
    () => (userEmail ? JSON.stringify(getOrderHistory(userEmail)) : "[]"),
    () => "[]"
  );
  const orders = useMemo(() => sortOrders(JSON.parse(ordersSnapshot) as OrderHistory[]), [ordersSnapshot]);

  const stats = useMemo(
    () => ({
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      activeOrders: orders.filter((order) => order.status !== "Đã hoàn thành").length,
    }),
    [orders]
  );

  const handleResetOrders = () => {
    if (!userEmail) {
      return;
    }

    const nextOrders = sortOrders(resetOrderHistory(userEmail));

    setExpandedOrderId(nextOrders[0]?.orderId ?? "");
  };

  const handleLogout = () => {
    clearCurrentUserEmail();
    router.push("/login");
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl border border-[#1A1A1A]/8 bg-white p-8 text-center shadow-[0_24px_80px_rgba(26,26,26,0.08)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#D4AF37]">Order history</p>
          <h1 className="mt-4 font-serif text-4xl text-[#1A1A1A] sm:text-5xl">Bạn cần đăng nhập để xem lịch sử đơn hàng</h1>
          <p className="mt-5 text-sm leading-7 text-[#1A1A1A]/68 sm:text-base">
            Vì dự án không dùng backend thật, lịch sử đơn hàng sẽ được lưu theo tài khoản trên chính trình duyệt này. Hãy đăng
            nhập hoặc tạo tài khoản để Aromis khởi tạo dữ liệu mẫu cho bạn.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="bg-[#1A1A1A] px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#D4AF37] hover:text-[#1A1A1A]"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="border border-[#1A1A1A]/12 px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#1A1A1A] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              Tạo tài khoản
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9F9] px-6 py-16 text-[#1A1A1A] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden border border-[#1A1A1A]/8 bg-white shadow-[0_24px_80px_rgba(26,26,26,0.08)]">
          <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#D4AF37]">Order archive</p>
              <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Lịch sử đơn hàng của bạn tại Aromis</h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#1A1A1A]/68 sm:text-base">
                Mỗi đơn hàng đều hiển thị ngày mua, trạng thái xử lý, chi tiết sản phẩm và tổng tiền rõ ràng. Toàn bộ dữ liệu đang
                được lưu bằng localStorage trên trình duyệt hiện tại.
              </p>
              <p className="mt-4 text-sm text-[#1A1A1A]/58">
                Tài khoản đang xem: <span className="font-semibold text-[#1A1A1A]">{userEmail}</span>
              </p>
            </div>

            <div className="grid gap-3 self-start sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="border border-[#1A1A1A]/8 bg-[#FCFBF8] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Đơn hàng</p>
                <p className="mt-3 font-serif text-3xl">{stats.totalOrders}</p>
              </div>
              <div className="border border-[#1A1A1A]/8 bg-[#FCFBF8] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Đang xử lý</p>
                <p className="mt-3 font-serif text-3xl">{stats.activeOrders}</p>
              </div>
              <div className="border border-[#1A1A1A]/8 bg-[#FCFBF8] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Tổng chi</p>
                <p className="mt-3 font-serif text-xl leading-tight">{formatCurrency(stats.totalSpent)}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#1A1A1A]/8 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <p className="text-sm text-[#1A1A1A]/62">Bạn có thể mở chi tiết từng đơn hoặc khôi phục lại dữ liệu mẫu bất cứ lúc nào.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleResetOrders}
                className="border border-[#1A1A1A]/12 px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#1A1A1A] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                Khôi phục dữ liệu mẫu
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-[#1A1A1A] px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#D4AF37] hover:text-[#1A1A1A]"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-5">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.orderId;

            return (
              <article
                key={order.orderId}
                className="overflow-hidden border border-[#1A1A1A]/8 bg-white shadow-[0_18px_50px_rgba(26,26,26,0.06)]"
              >
                <button
                  type="button"
                  onClick={() => setExpandedOrderId(isExpanded ? "" : order.orderId)}
                  className="flex w-full flex-col gap-4 px-6 py-6 text-left transition hover:bg-[#FCFBF8] sm:px-8 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">{order.orderId}</p>
                    <h2 className="mt-3 font-serif text-3xl">Đơn mua ngày {formatDate(order.purchaseDate)}</h2>
                    <p className="mt-3 text-sm text-[#1A1A1A]/62">
                      {order.items.length} sản phẩm • Tổng đơn {formatCurrency(order.totalAmount)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                    <span className={`border px-4 py-2 text-sm font-semibold ${statusClasses[order.status]}`}>{order.status}</span>
                    <span className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1A1A1A]/56">
                      {isExpanded ? "Thu gọn" : "Xem chi tiết"}
                    </span>
                  </div>
                </button>

                {isExpanded ? (
                  <div className="border-t border-[#1A1A1A]/8 px-6 py-6 sm:px-8">
                    <div className="grid gap-5 lg:grid-cols-2">
                      {order.items.map((item) => (
                        <div
                          key={`${order.orderId}-${item.productId}`}
                          className="grid gap-4 border border-[#1A1A1A]/8 bg-[#FCFBF8] p-4 sm:grid-cols-[120px_1fr]"
                        >
                          <div className="relative h-32 overflow-hidden border border-[#1A1A1A]/8 bg-white">
                            {item.image ? (
                              <Image src={item.image} alt={item.name} fill className="object-contain p-3" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-sm text-[#1A1A1A]/40">No image</div>
                            )}
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">{item.brand}</p>
                            <h3 className="mt-2 font-serif text-2xl leading-tight">{item.name}</h3>
                            <p className="mt-2 text-sm text-[#1A1A1A]/62">Dung tích {item.volume}</p>
                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#1A1A1A]/68">
                              <span>Số lượng: {item.quantity}</span>
                              <span>Đơn giá: {formatCurrency(item.price)}</span>
                            </div>
                            <p className="mt-4 text-base font-semibold text-[#1A1A1A]">
                              Thành tiền: {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 border-t border-[#1A1A1A]/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-[#1A1A1A]/62">Trạng thái đơn hàng được mô phỏng theo quy trình mua sắm trên website Aromis.</p>
                      <p className="font-serif text-2xl">Tổng cộng: {formatCurrency(order.totalAmount)}</p>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}