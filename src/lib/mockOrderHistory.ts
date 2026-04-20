export type MockOrderStatus = "Cho xac nhan" | "Dang chuan bi" | "Dang giao" | "Da hoan thanh";

export type MockPaymentStatus = "Cho thanh toan" | "Da thanh toan";

export type MockTrackingEventState = "completed" | "current" | "issue" | "neutral";

export type MockTrackingEvent = {
  time: string;
  title: string;
  description: string;
  state: MockTrackingEventState;
};

export type MockOrderSeed = {
  orderId: string;
  userId: string;
  purchaseDate: string;
  status: MockOrderStatus;
  paymentMethod: string;
  shippingAddress: string;
  items: ReadonlyArray<{
    productId: string;
    quantity: number;
  }>;
  shopName: string;
  shopTag: string;
  shopSubtitle: string;
  recipient: {
    fullName: string;
    phone: string;
    addressLine: string;
    ward: string;
    city: string;
  };
  paymentStatus: MockPaymentStatus;
  pricing?: {
    shippingFee?: number;
    shippingDiscount?: number;
    voucherDiscount?: number;
    finalTotal?: number;
  };
  fulfillment: {
    providerName: string;
    serviceLabel: string;
    trackingCode: string;
    timeline: ReadonlyArray<MockTrackingEvent>;
  };
  detailNote?: string;
};

export const mockOrderHistory: ReadonlyArray<MockOrderSeed> = [
  {
    orderId: "ARM-240403",
    userId: "seed-linh-huong",
    purchaseDate: "2026-04-03",
    status: "Da hoan thanh",
    paymentMethod: "Thanh toán khi nhận hàng",
    shippingAddress: "64 Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, TP.HCM",
    items: [
      { productId: "11", quantity: 1 },
      { productId: "12", quantity: 1 },
    ],
    shopName: "Aromis Signature",
    shopTag: "Chính hãng",
    shopSubtitle: "Nước hoa chính hãng giao nhanh trong ngày",
    recipient: {
      fullName: "Linh Hương",
      phone: "(+84) 905 118 326",
      addressLine: "64 Nguyễn Thị Minh Khai",
      ward: "Phường Võ Thị Sáu",
      city: "Quận 3, TP.HCM",
    },
    paymentStatus: "Da thanh toan",
    pricing: {
      shippingFee: 30000,
      shippingDiscount: 30000,
      voucherDiscount: 120000,
    },
    fulfillment: {
      providerName: "Aromis Express",
      serviceLabel: "Giao hỏa tốc trong ngày",
      trackingCode: "AROQ3-240403-88",
      timeline: [
        {
          time: "2026-04-03T10:12:00",
          title: "Đơn hàng đã đặt",
          description: "Aromis đã ghi nhận đơn hàng và đang chuẩn bị xác nhận thanh toán.",
          state: "completed",
        },
        {
          time: "2026-04-03T10:28:00",
          title: "Thanh toán đã được xác nhận",
          description: "Hệ thống đã xác nhận đơn COD và sắp xếp đóng gói ưu tiên.",
          state: "completed",
        },
        {
          time: "2026-04-03T12:05:00",
          title: "Đơn hàng đã bàn giao cho đơn vị vận chuyển",
          description: "Tài xế Aromis Express đã nhận đơn và bắt đầu giao trong khu vực trung tâm.",
          state: "completed",
        },
        {
          time: "2026-04-03T14:22:00",
          title: "Đơn hàng đã giao thành công",
          description: "Người nhận đã kiểm tra sản phẩm và hoàn tất thanh toán tại điểm giao.",
          state: "completed",
        },
      ],
    },
    detailNote: "Đánh giá trước 12-05-2026 để nhận ưu đãi cho đơn mua tiếp theo.",
  },
  {
    orderId: "ARM-240411",
    userId: "seed-linh-huong",
    purchaseDate: "2026-04-11",
    status: "Dang giao",
    paymentMethod: "Thẻ ngân hàng",
    shippingAddress: "64 Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, TP.HCM",
    items: [{ productId: "6", quantity: 1 }],
    shopName: "Aromis Signature",
    shopTag: "Chính hãng",
    shopSubtitle: "Nước hoa niche và designer được kiểm định",
    recipient: {
      fullName: "Linh Hương",
      phone: "(+84) 905 118 326",
      addressLine: "64 Nguyễn Thị Minh Khai",
      ward: "Phường Võ Thị Sáu",
      city: "Quận 3, TP.HCM",
    },
    paymentStatus: "Da thanh toan",
    pricing: {
      shippingFee: 35000,
      shippingDiscount: 35000,
      voucherDiscount: 80000,
    },
    fulfillment: {
      providerName: "Aromis Express",
      serviceLabel: "Giao nhanh 4 giờ",
      trackingCode: "AROQ3-240411-14",
      timeline: [
        {
          time: "2026-04-11T09:18:00",
          title: "Đơn hàng đã đặt",
          description: "Đơn hàng đã được tạo thành công từ tài khoản của bạn.",
          state: "completed",
        },
        {
          time: "2026-04-11T09:25:00",
          title: "Thanh toán đã được xác nhận",
          description: "Giao dịch thẻ ngân hàng thành công và đã được đối soát.",
          state: "completed",
        },
        {
          time: "2026-04-11T11:02:00",
          title: "Đơn hàng đang trên đường giao",
          description: "Tài xế đã rời kho và dự kiến giao trong khung 14:00 - 16:00 hôm nay.",
          state: "current",
        },
      ],
    },
    detailNote: "Đơn hàng đang được ưu tiên giao nhanh trong ngày tại khu vực nội thành.",
  },
  {
    orderId: "ARM-240406",
    userId: "seed-minh-chau",
    purchaseDate: "2026-04-06",
    status: "Da hoan thanh",
    paymentMethod: "Thẻ ngân hàng",
    shippingAddress: "18 Đường số 9, Linh Trung, Thủ Đức, TP.HCM",
    items: [
      { productId: "3", quantity: 1 },
      { productId: "9", quantity: 1 },
    ],
    shopName: "Aromis Signature",
    shopTag: "Chính hãng",
    shopSubtitle: "Phong cách nước hoa cao cấp cho quý ông và quý cô",
    recipient: {
      fullName: "Minh Châu",
      phone: "(+84) 988 603 419",
      addressLine: "18 Đường số 9",
      ward: "Linh Trung",
      city: "Thủ Đức, TP.HCM",
    },
    paymentStatus: "Da thanh toan",
    pricing: {
      shippingFee: 32000,
      shippingDiscount: 32000,
      voucherDiscount: 150000,
    },
    fulfillment: {
      providerName: "Aromis Express",
      serviceLabel: "Giao ưu tiên",
      trackingCode: "AROTD-240406-56",
      timeline: [
        {
          time: "2026-04-06T08:46:00",
          title: "Đơn hàng đã đặt",
          description: "Thông tin đơn hàng đã được tiếp nhận thành công.",
          state: "completed",
        },
        {
          time: "2026-04-06T09:03:00",
          title: "Thanh toán đã được xác nhận",
          description: "Aromis đã nhận giao dịch thanh toán thẻ ngân hàng.",
          state: "completed",
        },
        {
          time: "2026-04-06T13:35:00",
          title: "Đơn hàng đã giao cho đơn vị vận chuyển",
          description: "Sản phẩm đã được niêm phong chống va đập và bàn giao cho đội giao nhận.",
          state: "completed",
        },
        {
          time: "2026-04-07T09:41:00",
          title: "Đơn hàng đã giao thành công",
          description: "Khách hàng đã nhận đủ sản phẩm và ký xác nhận.",
          state: "completed",
        },
      ],
    },
    detailNote: "Bộ sưu tập này đã được giao kèm túi quà Aromis Signature.",
  },
  {
    orderId: "ARM-240417",
    userId: "seed-minh-chau",
    purchaseDate: "2026-04-17",
    status: "Cho xac nhan",
    paymentMethod: "Thanh toán khi nhận hàng",
    shippingAddress: "18 Đường số 9, Linh Trung, Thủ Đức, TP.HCM",
    items: [{ productId: "1", quantity: 1 }],
    shopName: "Aromis Signature",
    shopTag: "Chính hãng",
    shopSubtitle: "Nước hoa chính hãng có hóa đơn và tem kiểm định",
    recipient: {
      fullName: "Minh Châu",
      phone: "(+84) 988 603 419",
      addressLine: "18 Đường số 9",
      ward: "Linh Trung",
      city: "Thủ Đức, TP.HCM",
    },
    paymentStatus: "Cho thanh toan",
    pricing: {
      shippingFee: 28000,
      shippingDiscount: 28000,
      voucherDiscount: 50000,
    },
    fulfillment: {
      providerName: "Aromis Express",
      serviceLabel: "Giao ưu tiên",
      trackingCode: "AROTD-240417-61",
      timeline: [
        {
          time: "2026-04-17T16:12:00",
          title: "Đơn hàng đã đặt",
          description: "Đơn hàng đang chờ Aromis xác nhận và gợi ý phương thức đóng gói phù hợp.",
          state: "current",
        },
      ],
    },
    detailNote: "Đơn hàng COD sẽ được giữ tối đa 24 giờ trước khi hệ thống tự động hủy.",
  },
  {
    orderId: "ARM-240408",
    userId: "seed-hoang-nam",
    purchaseDate: "2026-04-08",
    status: "Dang chuan bi",
    paymentMethod: "Ví điện tử",
    shippingAddress: "52 Tố Hữu, Vạn Phúc, Hà Đông, Hà Nội",
    items: [
      { productId: "4", quantity: 1 },
      { productId: "7", quantity: 1 },
    ],
    shopName: "Aromis Signature",
    shopTag: "Chính hãng",
    shopSubtitle: "Dịch vụ gói quà cao cấp và khắc thông điệp theo yêu cầu",
    recipient: {
      fullName: "Hoàng Nam",
      phone: "(+84) 976 261 550",
      addressLine: "52 Tố Hữu",
      ward: "Vạn Phúc",
      city: "Hà Đông, Hà Nội",
    },
    paymentStatus: "Da thanh toan",
    pricing: {
      shippingFee: 40000,
      shippingDiscount: 20000,
      voucherDiscount: 120000,
    },
    fulfillment: {
      providerName: "Aromis Miền Bắc",
      serviceLabel: "Ưu tiên miền Bắc",
      trackingCode: "AROHN-240408-03",
      timeline: [
        {
          time: "2026-04-08T08:04:00",
          title: "Đơn hàng đã đặt",
          description: "Đơn hàng đã được ghi nhận thành công trên hệ thống Aromis.",
          state: "completed",
        },
        {
          time: "2026-04-08T08:11:00",
          title: "Thanh toán đã được xác nhận",
          description: "Ví điện tử đã thanh toán và sẵn sàng cho bước đóng gói.",
          state: "completed",
        },
        {
          time: "2026-04-08T10:26:00",
          title: "Đơn hàng đang được đóng gói",
          description: "Sản phẩm đang được niêm phong, bọc chống sốc và gắn thẻ bảo hành mùi hương.",
          state: "current",
        },
      ],
    },
    detailNote: "Đơn hàng có kèm gift set mini và thông điệp cá nhân theo yêu cầu.",
  },
];