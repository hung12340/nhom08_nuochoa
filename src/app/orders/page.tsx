"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import OrderDetailPanel from "@/components/orders/OrderDetailPanel";
import AccountAvatar from "@/components/ui/AccountAvatar";
import { useCurrentAccount } from "@/hooks/useCurrentAccount";
import {
  getOrdersByUserId,
  initializeOrderHistoryForUser,
  subscribeToOrderHistoryStore,
  type OrderHistoryRecord,
  type OrderStatus,
} from "@/lib/orderHistory";

type FilterKey = "all" | OrderStatus;

const statusClasses: Record<OrderStatus, string> = {
  "Cho xac nhan": "border-amber-200 bg-amber-50 text-amber-700",
  "Dang chuan bi": "border-sky-200 bg-sky-50 text-sky-700",
  "Dang giao": "border-violet-200 bg-violet-50 text-violet-700",
  "Da hoan thanh": "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const statusLabels: Record<OrderStatus, string> = {
  "Cho xac nhan": "Chờ xác nhận",
  "Dang chuan bi": "Đang chuẩn bị",
  "Dang giao": "Đang giao",
  "Da hoan thanh": "Đã hoàn thành",
};

const paymentStatusLabels = {
  "Cho thanh toan": "Chờ thanh toán",
  "Da thanh toan": "Đã thanh toán",
} as const;

const providerLabels = {
  credentials: "Tài khoản nội bộ",
  google: "Google",
  github: "GitHub",
} as const;

const filterOptions: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "Tất cả" },
  { key: "Cho xac nhan", label: "Chờ xác nhận" },
  { key: "Dang chuan bi", label: "Đang chuẩn bị" },
  { key: "Dang giao", label: "Đang giao" },
  { key: "Da hoan thanh", label: "Đã hoàn thành" },
];

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

function getStats(orders: OrderHistoryRecord[]) {
  return {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    activeOrders: orders.filter((order) => order.status !== "Da hoan thanh").length,
  };
}

function getOrderUnitCount(order: OrderHistoryRecord) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

function getOrderSearchText(order: OrderHistoryRecord) {
  return [
    order.orderId,
    order.paymentMethod,
    order.shippingAddress,
    order.shop.name,
    order.shop.subtitle,
    order.recipient.fullName,
    order.fulfillment.providerName,
    order.fulfillment.trackingCode,
    ...order.items.flatMap((item) => [item.name, item.brand, item.volume]),
  ]
    .join(" ")
    .toLowerCase();
}

export default function OrdersPage() {
  const currentAccount = useCurrentAccount();
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("all");
  const [expandedOrderId, setExpandedOrderId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm.trim().toLowerCase());
  const ordersSnapshot = useSyncExternalStore(
    subscribeToOrderHistoryStore,
    () => (currentAccount ? JSON.stringify(getOrdersByUserId(currentAccount.id)) : "[]"),
    () => "[]"
  );
  const orders = useMemo(() => JSON.parse(ordersSnapshot) as OrderHistoryRecord[], [ordersSnapshot]);
  const stats = getStats(orders);

  useEffect(() => {
    if (!currentAccount) {
      return;
    }

    initializeOrderHistoryForUser(currentAccount.id);
  }, [currentAccount]);

  const statusCounts = useMemo(
    () =>
      ({
        all: orders.length,
        "Cho xac nhan": orders.filter((order) => order.status === "Cho xac nhan").length,
        "Dang chuan bi": orders.filter((order) => order.status === "Dang chuan bi").length,
        "Dang giao": orders.filter((order) => order.status === "Dang giao").length,
        "Da hoan thanh": orders.filter((order) => order.status === "Da hoan thanh").length,
      }) as Record<FilterKey, number>,
    [orders]
  );

  const filteredOrders = useMemo(() => {
    const nextOrders = selectedFilter === "all" ? orders : orders.filter((order) => order.status === selectedFilter);

    if (!deferredSearchTerm) {
      return nextOrders;
    }

    return nextOrders.filter((order) => getOrderSearchText(order).includes(deferredSearchTerm));
  }, [deferredSearchTerm, orders, selectedFilter]);

  const activeOrderId = filteredOrders.some((order) => order.orderId === expandedOrderId)
    ? expandedOrderId
    : filteredOrders[0]?.orderId ?? "";

  const resetFilters = () => {
    setSelectedFilter("all");
    setSearchTerm("");
  };

  if (!currentAccount) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f9f9f9_0%,#f4efe2_100%)] px-6 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl rounded-4xl border border-[#1A1A1A]/8 bg-white p-8 text-center shadow-[0_24px_80px_rgba(26,26,26,0.08)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#D4AF37]">Đơn mua</p>
          <h1 className="mt-4 font-serif text-4xl text-[#1A1A1A] sm:text-5xl">Bạn cần đăng nhập để xem lịch sử đơn hàng</h1>
          <p className="mt-5 text-sm leading-7 text-[#1A1A1A]/68 sm:text-base">
            Mọi đơn hàng sẽ được hiển thị theo đúng tài khoản đang đăng nhập, kèm trạng thái và chi tiết mua sắm rõ ràng.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="rounded-full bg-[#1A1A1A] px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#D4AF37] hover:text-[#1A1A1A]"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-[#1A1A1A]/12 px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-[#1A1A1A] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              Tạo tài khoản
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.12),transparent_24%),linear-gradient(180deg,#f9f9f9_0%,#f4efe2_100%)] px-6 py-14 text-[#1A1A1A] sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-4xl border border-[#1A1A1A]/8 bg-white p-6 shadow-[0_24px_80px_rgba(26,26,26,0.08)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <AccountAvatar name={currentAccount.displayName} avatarUrl={currentAccount.avatarUrl} size="lg" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Aromis chính hãng</p>
                <h1 className="mt-2 font-serif text-4xl leading-tight text-[#1A1A1A] sm:text-5xl">Đơn mua</h1>
                <p className="mt-2 text-sm text-[#1A1A1A]/62">
                  {currentAccount.displayName} • {providerLabels[currentAccount.provider]}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#1A1A1A]/66 sm:text-base">
                  Theo dõi trạng thái xử lý, mở chi tiết từng đơn và kiểm tra lại các chai nước hoa đã mua trong cùng một màn hình.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-[#1A1A1A]/8 bg-[#FCFBF8] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Đơn hàng</p>
                <p className="mt-3 font-serif text-3xl">{stats.totalOrders}</p>
              </div>
              <div className="rounded-3xl border border-[#1A1A1A]/8 bg-[#FCFBF8] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Đang xử lý</p>
                <p className="mt-3 font-serif text-3xl">{stats.activeOrders}</p>
              </div>
              <div className="rounded-3xl border border-[#1A1A1A]/8 bg-[#FCFBF8] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Tổng chi</p>
                <p className="mt-3 font-serif text-xl leading-tight">{formatCurrency(stats.totalSpent)}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 border-t border-[#1A1A1A]/8 pt-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <label className="flex items-center gap-3 rounded-3xl border border-[#1A1A1A]/10 bg-[#FCFBF8] px-4 py-3.5 text-sm text-[#1A1A1A]/62 transition focus-within:border-[#D4AF37] focus-within:bg-white">
              <svg className="h-5 w-5 shrink-0 text-[#1A1A1A]/46" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm theo mã đơn, mã vận đơn, tên sản phẩm hoặc tên người nhận"
                className="w-full bg-transparent text-sm text-[#1A1A1A] outline-none placeholder:text-[#1A1A1A]/36"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSelectedFilter(option.key)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    selectedFilter === option.key
                      ? "bg-[#1A1A1A] text-white"
                      : "border border-[#1A1A1A]/10 bg-white text-[#1A1A1A]/72 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  }`}
                >
                  {option.label}
                  <span className={`ml-2 inline-flex min-w-6 justify-center rounded-full px-1.5 py-0.5 text-xs ${selectedFilter === option.key ? "bg-white/16 text-white" : "bg-[#F4F1E8] text-[#1A1A1A]/62"}`}>
                    {statusCounts[option.key]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {filteredOrders.length > 0 ? (
          <section className="mt-8 space-y-4">
            {filteredOrders.map((order) => {
              const isExpanded = activeOrderId === order.orderId;
              const totalUnits = getOrderUnitCount(order);
              const latestEvent = order.fulfillment.timeline[order.fulfillment.timeline.length - 1];

              return (
                <article
                  key={order.orderId}
                  className="overflow-hidden rounded-4xl border border-[#1A1A1A]/8 bg-white shadow-[0_18px_50px_rgba(26,26,26,0.06)]"
                >
                  <div className="flex flex-col gap-3 border-b border-[#1A1A1A]/8 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-[#1A1A1A] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                        {order.shop.tag}
                      </span>
                      <p className="text-sm font-semibold text-[#1A1A1A]">{order.shop.name}</p>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1A1A1A]/56">{order.orderId}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm text-[#1A1A1A]/56">Ngày đặt: {formatDate(order.purchaseDate)}</p>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandedOrderId(isExpanded ? "" : order.orderId)}
                    className="group w-full px-5 py-5 text-left transition hover:bg-[#FCFBF8] sm:px-6"
                  >
                    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
                      <div className="space-y-3">
                        {order.items.slice(0, 2).map((item) => (
                          <div
                            key={`${order.orderId}-preview-${item.productId}`}
                            className="flex flex-col gap-4 rounded-3xl bg-[#FCFBF8] p-4 sm:flex-row sm:items-center"
                          >
                            <div className="flex h-22 w-22 shrink-0 items-center justify-center rounded-3xl bg-[#F6F2E7] p-3">
                              {item.image ? (
                                <div
                                  role="img"
                                  aria-label={item.name}
                                  className="h-full w-full bg-contain bg-center bg-no-repeat"
                                  style={{ backgroundImage: `url(${item.image})` }}
                                />
                              ) : (
                                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/32">Aromis</div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-lg font-semibold text-[#1A1A1A]">{item.name}</p>
                              <p className="mt-1 text-sm text-[#1A1A1A]/58">{item.brand} • {item.volume}</p>
                              <p className="mt-2 text-sm text-[#1A1A1A]/62">Số lượng: x{item.quantity}</p>
                            </div>

                            <div className="text-left sm:text-right">
                              <p className="text-sm text-[#1A1A1A]/58">Giá lúc mua</p>
                              <p className="mt-2 text-base font-semibold text-[#1A1A1A]">{formatCurrency(item.price)}</p>
                            </div>
                          </div>
                        ))}

                        {order.items.length > 2 ? (
                          <div className="rounded-3xl border border-dashed border-[#D4AF37]/45 bg-[#FFF9E9] px-4 py-3 text-sm text-[#7F5B00]">
                            +{order.items.length - 2} sản phẩm khác trong cùng đơn hàng
                          </div>
                        ) : null}
                      </div>

                      <div className="rounded-3xl border border-[#1A1A1A]/8 bg-white p-5 xl:sticky xl:top-28">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">Tổng thanh toán</p>
                            <p className="mt-3 font-serif text-3xl text-[#1A1A1A]">{formatCurrency(order.totalAmount)}</p>
                          </div>
                          <span className="rounded-full bg-[#F4F1E8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#1A1A1A]/62">
                            {isExpanded ? "Đang mở chi tiết" : "Mở hồ sơ đơn"}
                          </span>
                        </div>

                        <div className="mt-5 space-y-3 text-sm text-[#1A1A1A]/66">
                          <p>
                            Tổng số chai: <span className="font-semibold text-[#1A1A1A]">{totalUnits}</span>
                          </p>
                          <p>
                            Thanh toán: <span className="font-semibold text-[#1A1A1A]">{order.paymentMethod}</span>
                          </p>
                          <p>
                            Giao đến: <span className="font-semibold text-[#1A1A1A]">{order.shippingAddress}</span>
                          </p>
                        </div>

                        <div className="mt-6 inline-flex items-center justify-center rounded-full bg-[#1A1A1A] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition group-hover:bg-[#D4AF37] group-hover:text-[#1A1A1A]">
                          {isExpanded ? "Thu gọn chi tiết" : "Xem chi tiết"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 rounded-3xl bg-[#FCFBF8] p-4 sm:grid-cols-3">
                      <div className="rounded-2xl border border-[#1A1A1A]/8 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">Đơn vị giao</p>
                        <p className="mt-2 text-sm font-semibold text-[#1A1A1A]">{order.fulfillment.providerName}</p>
                        <p className="mt-1 text-sm text-[#1A1A1A]/56">{order.fulfillment.serviceLabel}</p>
                      </div>

                      <div className="rounded-2xl border border-[#1A1A1A]/8 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">Thanh toán</p>
                        <p className="mt-2 text-sm font-semibold text-[#1A1A1A]">{paymentStatusLabels[order.paymentStatus]}</p>
                        <p className="mt-1 text-sm text-[#1A1A1A]/56">{order.paymentMethod}</p>
                      </div>

                      <div className="rounded-2xl border border-[#1A1A1A]/8 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">Cập nhật mới nhất</p>
                        <p className="mt-2 text-sm font-semibold text-[#1A1A1A]">{latestEvent?.title ?? "Đang cập nhật"}</p>
                        <p className="mt-1 text-sm text-[#1A1A1A]/56">Mã vận đơn: {order.fulfillment.trackingCode}</p>
                      </div>
                    </div>
                  </button>

                  {isExpanded ? <OrderDetailPanel order={order} formatCurrency={formatCurrency} /> : null}
                </article>
              );
            })}
          </section>
        ) : (
          <section className="mt-8 rounded-4xl border border-[#1A1A1A]/8 bg-white p-8 shadow-[0_18px_50px_rgba(26,26,26,0.06)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#D4AF37]">Đơn mua</p>
            <h2 className="mt-4 font-serif text-4xl text-[#1A1A1A]">Không tìm thấy đơn hàng phù hợp</h2>
            <p className="mt-5 text-sm leading-7 text-[#1A1A1A]/68 sm:text-base">
              Hãy thử đổi trạng thái đang lọc hoặc xóa từ khóa tìm kiếm để xem toàn bộ đơn mua của tài khoản này.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center justify-center rounded-full bg-[#1A1A1A] px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#D4AF37] hover:text-[#1A1A1A]"
              >
                Xóa bộ lọc
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-[#1A1A1A]/12 px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#1A1A1A] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}