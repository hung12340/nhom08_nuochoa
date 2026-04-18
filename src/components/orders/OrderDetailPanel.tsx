import Link from "next/link";
import { type OrderHistoryRecord, type OrderStatus, type PaymentStatus, type TrackingEventState } from "@/lib/orderHistory";

type OrderDetailPanelProps = {
  order: OrderHistoryRecord;
  formatCurrency: (value: number) => string;
};

const statusLabels: Record<OrderStatus, string> = {
  "Cho xac nhan": "Chờ xác nhận",
  "Dang chuan bi": "Đang chuẩn bị",
  "Dang giao": "Đang giao",
  "Da hoan thanh": "Đã hoàn thành",
};

const statusHeadlines: Record<OrderStatus, string> = {
  "Cho xac nhan": "Đơn hàng đang chờ xác nhận từ cửa hàng",
  "Dang chuan bi": "Aromis đang hoàn thiện đóng gói và kiểm định",
  "Dang giao": "Đơn hàng đang trên đường giao đến bạn",
  "Da hoan thanh": "Đơn hàng đã được giao thành công",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  "Cho thanh toan": "Chờ thanh toán",
  "Da thanh toan": "Đã thanh toán",
};

const progressSteps: Array<{ key: OrderStatus; label: string; caption: string }> = [
  { key: "Cho xac nhan", label: "Đã đặt", caption: "Aromis ghi nhận đơn hàng" },
  { key: "Dang chuan bi", label: "Đã xác nhận", caption: "Đang chuẩn bị và đóng gói" },
  { key: "Dang giao", label: "Vận chuyển", caption: "Đơn đang được giao đến bạn" },
  { key: "Da hoan thanh", label: "Hoàn tất", caption: "Bạn đã nhận đủ sản phẩm" },
];

function formatDateTime(dateString: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  }).format(new Date(dateString));
}

function getCurrentStepIndex(status: OrderStatus) {
  return progressSteps.findIndex((step) => step.key === status);
}

function getPrimaryActionLabel(status: OrderStatus) {
  if (status === "Da hoan thanh") {
    return "Đánh giá mùi hương";
  }

  if (status === "Dang giao") {
    return "Theo dõi giao hàng";
  }

  return "Liên hệ xác nhận";
}

function getTimelineStateClasses(state: TrackingEventState) {
  if (state === "completed") {
    return {
      bullet: "border-emerald-500 bg-emerald-500 text-white",
      title: "text-emerald-700",
    };
  }

  if (state === "current") {
    return {
      bullet: "border-[#D4AF37] bg-[#FFF3C4] text-[#8A6400]",
      title: "text-[#8A6400]",
    };
  }

  if (state === "issue") {
    return {
      bullet: "border-rose-500 bg-rose-100 text-rose-600",
      title: "text-rose-700",
    };
  }

  return {
    bullet: "border-[#1A1A1A]/10 bg-white text-[#1A1A1A]/35",
    title: "text-[#1A1A1A]/72",
  };
}

function ProgressIcon({ stepKey, isReached }: { stepKey: OrderStatus; isReached: boolean }) {
  const strokeColor = isReached ? "currentColor" : "rgba(26,26,26,0.35)";

  if (stepKey === "Cho xac nhan") {
    return (
      <svg className="h-5 w-5" fill="none" stroke={strokeColor} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V5a4 4 0 118 0v2m-9 0h10a1 1 0 011 1v9a1 1 0 01-1 1H7a1 1 0 01-1-1V8a1 1 0 011-1z" />
      </svg>
    );
  }

  if (stepKey === "Dang chuan bi") {
    return (
      <svg className="h-5 w-5" fill="none" stroke={strokeColor} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8 4-8-4m16 0l-8-4-8 4m16 0v10l-8 4m-8-14v10l8 4m0-10l8-4" />
      </svg>
    );
  }

  if (stepKey === "Dang giao") {
    return (
      <svg className="h-5 w-5" fill="none" stroke={strokeColor} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 17h6m-9 0H5a2 2 0 01-2-2V7a2 2 0 012-2h9a2 2 0 012 2v1m0 0h2.586a1 1 0 01.707.293l2.414 2.414A1 1 0 0124 12.414V15a2 2 0 01-2 2h-1m-3-9v9m-9 0a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z" transform="translate(-1 0)" />
      </svg>
    );
  }

  return (
    <svg className="h-5 w-5" fill="none" stroke={strokeColor} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.198 3.69a1 1 0 00.95.69h3.878c.969 0 1.371 1.24.588 1.81l-3.137 2.279a1 1 0 00-.364 1.118l1.198 3.69c.3.921-.755 1.688-1.538 1.118l-3.137-2.279a1 1 0 00-1.176 0l-3.137 2.279c-.783.57-1.838-.197-1.539-1.118l1.199-3.69a1 1 0 00-.364-1.118L2.485 9.117c-.783-.57-.38-1.81.588-1.81h3.878a1 1 0 00.951-.69l1.147-3.69z" />
    </svg>
  );
}

function TimelineBullet({ state }: { state: TrackingEventState }) {
  const classes = getTimelineStateClasses(state);

  return (
    <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${classes.bullet}`}>
      {state === "completed" ? "✓" : state === "issue" ? "!" : "•"}
    </span>
  );
}

export default function OrderDetailPanel({ order, formatCurrency }: OrderDetailPanelProps) {
  const currentStepIndex = getCurrentStepIndex(order.status);
  const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const latestEvent = order.fulfillment.timeline[order.fulfillment.timeline.length - 1];
  const outstandingAmount = order.paymentStatus === "Cho thanh toan" ? order.totalAmount : 0;

  return (
    <div className="border-t border-[#D4AF37]/18 bg-[linear-gradient(180deg,#fffdf8_0%,#f7f1e4_100%)] px-5 py-6 sm:px-6">
      <div className="overflow-hidden rounded-4xl border border-[#D4AF37]/22 bg-white shadow-[0_28px_80px_rgba(26,26,26,0.1)]">
        <div className="grid gap-6 border-b border-[#1A1A1A]/8 px-5 py-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              <span>Hồ sơ đơn hàng</span>
              <span className="text-[#1A1A1A]/34">|</span>
              <span className="text-[#1A1A1A]/56">{order.orderId}</span>
            </div>
            <h3 className="mt-4 font-serif text-3xl leading-tight text-[#1A1A1A] sm:text-4xl">{statusHeadlines[order.status]}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#1A1A1A]/66 sm:text-base">
              Theo dõi toàn bộ hành trình xử lý, vận chuyển và thanh toán của đơn hàng ngay trong cùng một màn hình, giống trải nghiệm của một nền tảng thương mại điện tử hoàn chỉnh.
            </p>

            {order.detailNote ? (
              <div className="mt-5 rounded-3xl border border-[#D4AF37]/30 bg-[#FFF7DE] px-4 py-3 text-sm leading-7 text-[#7F5B00]">
                {order.detailNote}
              </div>
            ) : null}
          </div>

          <div className="rounded-[1.75rem] bg-[#1A1A1A] p-5 text-white shadow-[0_22px_40px_rgba(26,26,26,0.16)]">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#D4AF37]">Thanh toán cuối cùng</p>
            <p className="mt-3 font-serif text-4xl leading-none">{formatCurrency(order.totalAmount)}</p>
            <div className="mt-4 space-y-3 text-sm text-white/78">
              <p>
                Trạng thái đơn: <span className="font-semibold text-white">{statusLabels[order.status]}</span>
              </p>
              <p>
                Thanh toán: <span className="font-semibold text-white">{paymentStatusLabels[order.paymentStatus]}</span>
              </p>
              <p>
                Đơn vị giao: <span className="font-semibold text-white">{order.fulfillment.providerName}</span>
              </p>
              <p>
                Mã vận đơn: <span className="font-semibold text-white">{order.fulfillment.trackingCode}</span>
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href={order.status === "Da hoan thanh" ? "/products" : "/contact"}
                className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1A1A1A] transition hover:bg-white"
              >
                {getPrimaryActionLabel(order.status)}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/18 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                Liên hệ cửa hàng
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/18 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                Mua lại
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-b border-[#1A1A1A]/8 px-5 py-5 md:grid-cols-4 lg:px-6">
          {progressSteps.map((step, index) => {
            const isReached = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={`${order.orderId}-${step.key}`}
                className={`rounded-3xl border px-4 py-4 transition ${
                  isCurrent
                    ? "border-[#D4AF37] bg-[#FFF6DB]"
                    : isReached
                      ? "border-[#D4AF37]/30 bg-white"
                      : "border-[#1A1A1A]/8 bg-[#FAF8F2]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                      isReached
                        ? "border-[#D4AF37] bg-[#FFF0BF] text-[#8A6400]"
                        : "border-[#1A1A1A]/12 bg-white text-[#1A1A1A]/32"
                    }`}
                  >
                    <ProgressIcon stepKey={step.key} isReached={isReached} />
                  </span>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isReached ? "text-[#D4AF37]" : "text-[#1A1A1A]/35"}`}>
                      Bước {index + 1}
                    </p>
                    <p className={`mt-1 text-sm font-semibold ${isReached ? "text-[#1A1A1A]" : "text-[#1A1A1A]/45"}`}>{step.label}</p>
                  </div>
                </div>
                <p className={`mt-3 text-sm leading-6 ${isReached ? "text-[#1A1A1A]/66" : "text-[#1A1A1A]/40"}`}>{step.caption}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 px-5 py-6 lg:px-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-4">
            <section className="rounded-[1.75rem] border border-[#1A1A1A]/8 bg-[#FCFBF8] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">Địa chỉ nhận hàng</p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[#1A1A1A]/68">
                <p className="text-lg font-semibold text-[#1A1A1A]">{order.recipient.fullName}</p>
                <p>{order.recipient.phone}</p>
                <p>{order.recipient.addressLine}</p>
                <p>{order.recipient.ward}</p>
                <p>{order.recipient.city}</p>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-[#1A1A1A]/8 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">Thông tin vận chuyển</p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[#1A1A1A]/68">
                <p>
                  Đơn vị giao: <span className="font-semibold text-[#1A1A1A]">{order.fulfillment.providerName}</span>
                </p>
                <p>
                  Dịch vụ: <span className="font-semibold text-[#1A1A1A]">{order.fulfillment.serviceLabel}</span>
                </p>
                <p>
                  Mã vận đơn: <span className="font-semibold text-[#1A1A1A]">{order.fulfillment.trackingCode}</span>
                </p>
                <p>
                  Cập nhật gần nhất: <span className="font-semibold text-[#1A1A1A]">{latestEvent ? formatDateTime(latestEvent.time) : "Đang cập nhật"}</span>
                </p>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-[#1A1A1A]/8 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">Thanh toán</p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[#1A1A1A]/68">
                <p>
                  Phương thức: <span className="font-semibold text-[#1A1A1A]">{order.paymentMethod}</span>
                </p>
                <p>
                  Tình trạng: <span className="font-semibold text-[#1A1A1A]">{paymentStatusLabels[order.paymentStatus]}</span>
                </p>
                <p>
                  Tổng số sản phẩm: <span className="font-semibold text-[#1A1A1A]">{totalUnits}</span>
                </p>
              </div>

              {outstandingAmount > 0 ? (
                <div className="mt-4 rounded-3xl border border-[#D4AF37]/30 bg-[#FFF7DE] px-4 py-3 text-sm leading-7 text-[#7F5B00]">
                  Vui lòng chuẩn bị {formatCurrency(outstandingAmount)} khi nhận hàng.
                </div>
              ) : null}
            </section>
          </div>

          <div className="space-y-4">
            <section className="rounded-[1.75rem] border border-[#1A1A1A]/8 bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-3 border-b border-[#1A1A1A]/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">Hành trình giao hàng</p>
                  <h4 className="mt-2 text-xl font-semibold text-[#1A1A1A]">{statusHeadlines[order.status]}</h4>
                </div>
                <p className="text-sm text-[#1A1A1A]/56">{order.fulfillment.providerName} • {order.fulfillment.serviceLabel}</p>
              </div>

              <div className="mt-6 space-y-5">
                {order.fulfillment.timeline.map((event, index) => {
                  const stateClasses = getTimelineStateClasses(event.state);

                  return (
                    <div key={`${order.orderId}-${event.time}-${index}`} className="grid gap-4 md:grid-cols-[160px_28px_minmax(0,1fr)]">
                      <div className="text-sm font-semibold text-[#1A1A1A]">{formatDateTime(event.time)}</div>

                      <div className="relative flex justify-center">
                        <TimelineBullet state={event.state} />
                        {index < order.fulfillment.timeline.length - 1 ? (
                          <span className="absolute top-7 h-[calc(100%+20px)] w-px bg-[#1A1A1A]/10" />
                        ) : null}
                      </div>

                      <div className="pb-1">
                        <p className={`text-base font-semibold ${stateClasses.title}`}>{event.title}</p>
                        <p className="mt-1 text-sm leading-7 text-[#1A1A1A]/66">{event.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-[#1A1A1A]/8 bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-4 border-b border-[#1A1A1A]/8 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#1A1A1A] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">{order.shop.tag}</span>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">Cửa hàng</span>
                  </div>
                  <h4 className="mt-3 text-xl font-semibold text-[#1A1A1A]">{order.shop.name}</h4>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-[#1A1A1A]/62">{order.shop.subtitle}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-full border border-[#1A1A1A]/10 px-4 py-2 text-sm font-semibold text-[#1A1A1A] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  >
                    Chat cửa hàng
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-full border border-[#1A1A1A]/10 px-4 py-2 text-sm font-semibold text-[#1A1A1A] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  >
                    Xem cửa hàng
                  </Link>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={`${order.orderId}-${item.productId}`}
                    className="grid gap-4 rounded-3xl border border-[#1A1A1A]/8 bg-[#FCFBF8] p-4 sm:grid-cols-[88px_minmax(0,1fr)_140px] sm:items-center"
                  >
                    <div className="flex h-22 w-22 items-center justify-center rounded-[1.25rem] bg-white p-3">
                      {item.image ? (
                        <div
                          role="img"
                          aria-label={item.name}
                          className="h-full w-full bg-contain bg-center bg-no-repeat"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                      ) : (
                        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/32">Aromis</div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-base font-semibold text-[#1A1A1A]">{item.name}</p>
                      <p className="mt-1 text-sm text-[#1A1A1A]/56">{item.brand} • {item.volume}</p>
                      <p className="mt-2 text-sm text-[#1A1A1A]/62">Số lượng: x{item.quantity}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm text-[#1A1A1A]/56">Giá tại thời điểm mua</p>
                      <p className="mt-2 text-lg font-semibold text-[#1A1A1A]">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[1.75rem] bg-[#1A1A1A] p-5 text-white shadow-[0_24px_50px_rgba(26,26,26,0.16)] sm:p-6">
              <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">Chi tiết thanh toán</p>
                  <h4 className="mt-2 text-xl font-semibold text-white">Tổng hợp chi phí đơn hàng</h4>
                </div>
                <p className="text-sm text-white/60">Phương thức: {order.paymentMethod}</p>
              </div>

              <div className="mt-5 space-y-3 text-sm text-white/76">
                <div className="flex items-center justify-between gap-4">
                  <span>Tổng tiền hàng</span>
                  <span className="font-semibold text-white">{formatCurrency(order.pricing.merchandiseSubtotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-white">{formatCurrency(order.pricing.shippingFee)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Giảm phí vận chuyển</span>
                  <span className="font-semibold text-[#D4AF37]">-{formatCurrency(order.pricing.shippingDiscount)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Ưu đãi Aromis</span>
                  <span className="font-semibold text-[#D4AF37]">-{formatCurrency(order.pricing.voucherDiscount)}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                <span className="text-base font-semibold text-white">Thành tiền</span>
                <span className="font-serif text-3xl text-[#D4AF37]">{formatCurrency(order.pricing.finalTotal)}</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
