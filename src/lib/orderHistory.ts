import productsData from "@/lib/data.json";
import { mockOrderHistory, type MockOrderSeed } from "@/lib/mockOrderHistory";

export type OrderStatus = "Cho xac nhan" | "Dang chuan bi" | "Dang giao" | "Da hoan thanh";
export type PaymentStatus = "Cho thanh toan" | "Da thanh toan";
export type TrackingEventState = "completed" | "current" | "issue" | "neutral";

export type OrderHistoryItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  brand: string;
  volume: string;
  image: string;
};

export type OrderShop = {
  name: string;
  tag: string;
  subtitle: string;
};

export type OrderRecipient = {
  fullName: string;
  phone: string;
  addressLine: string;
  ward: string;
  city: string;
};

export type OrderPricing = {
  merchandiseSubtotal: number;
  shippingFee: number;
  shippingDiscount: number;
  voucherDiscount: number;
  finalTotal: number;
};

export type OrderTrackingEvent = {
  time: string;
  title: string;
  description: string;
  state: TrackingEventState;
};

export type OrderFulfillment = {
  providerName: string;
  serviceLabel: string;
  trackingCode: string;
  timeline: OrderTrackingEvent[];
};

export type OrderHistoryRecord = {
  orderId: string;
  purchaseDate: string;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: string;
  items: OrderHistoryItem[];
  shop: OrderShop;
  recipient: OrderRecipient;
  paymentStatus: PaymentStatus;
  pricing: OrderPricing;
  fulfillment: OrderFulfillment;
  detailNote?: string;
  totalAmount: number;
};

type ProductRecord = {
  id: string;
  name: string;
  brand: string;
  price: number;
  volume: string;
  images: string[];
};

type OrderHistoryMap = Record<string, OrderHistoryRecord[]>;

const ORDER_STORAGE_KEY = "aromis_order_history_v4";
const LEGACY_ORDER_STORAGE_KEY = "aromis_order_history_v3";
const ORDER_STORAGE_EVENT = "aromis-orders";
const products = productsData as ProductRecord[];
const mockOrderHistoryById = new Map(mockOrderHistory.map((order) => [order.orderId, order]));

function isBrowser() {
  return typeof window !== "undefined";
}

function emitOrderStorageChange() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(ORDER_STORAGE_EVENT));
}

function readStorage<T>(key: string, fallback: T) {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);

    if (!rawValue) {
      return fallback;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
  emitOrderStorageChange();
}

function sortOrders(orders: OrderHistoryRecord[]) {
  return [...orders].sort(
    (left, right) =>
      new Date(`${right.purchaseDate}T12:00:00`).getTime() - new Date(`${left.purchaseDate}T12:00:00`).getTime()
  );
}

function findProduct(productId: string) {
  return products.find((product) => product.id === productId);
}

function buildOrderItem(productId: string, quantity: number): OrderHistoryItem {
  const product = findProduct(productId);

  return {
    productId,
    name: product?.name ?? "Sản phẩm Aromis",
    quantity,
    price: product?.price ?? 0,
    brand: product?.brand ?? "Aromis",
    volume: product?.volume ?? "100ml",
    image: product?.images[0] ?? "",
  };
}

function normalizePaymentMethod(paymentMethod: string) {
  if (paymentMethod === "Thanh toan khi nhan hang") {
    return "Thanh toán khi nhận hàng";
  }

  if (paymentMethod === "The ngan hang") {
    return "Thẻ ngân hàng";
  }

  if (paymentMethod === "Vi dien tu") {
    return "Ví điện tử";
  }

  return paymentMethod;
}

function calculateOrderTotal(items: OrderHistoryItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

function buildShop(seed?: Pick<MockOrderSeed, "shopName" | "shopTag" | "shopSubtitle">, fallbackBrand?: string): OrderShop {
  return {
    name: seed?.shopName ?? "Aromis Signature",
    tag: seed?.shopTag ?? "Chính hãng",
    subtitle: seed?.shopSubtitle ?? fallbackBrand ?? "Nước hoa chính hãng được kiểm định tại Aromis",
  };
}

function buildRecipient(
  shippingAddress: string,
  seed?: MockOrderSeed["recipient"]
): OrderRecipient {
  if (seed) {
    return { ...seed };
  }

  const [addressLine = shippingAddress, city = "TP.HCM"] = shippingAddress.split(",").map((segment) => segment.trim());

  return {
    fullName: "Khách hàng Aromis",
    phone: "Đang cập nhật",
    addressLine,
    ward: "Khu vực giao hàng",
    city,
  };
}

function buildPricing(
  items: OrderHistoryItem[],
  pricing?: MockOrderSeed["pricing"],
  fallbackFinalTotal?: number
): OrderPricing {
  const merchandiseSubtotal = calculateOrderTotal(items);

  if (pricing) {
    const shippingFee = pricing.shippingFee ?? 0;
    const shippingDiscount = pricing.shippingDiscount ?? 0;
    const voucherDiscount = pricing.voucherDiscount ?? 0;
    const finalTotal =
      pricing.finalTotal ??
      Math.max(merchandiseSubtotal + shippingFee - shippingDiscount - voucherDiscount, 0);

    return {
      merchandiseSubtotal,
      shippingFee,
      shippingDiscount,
      voucherDiscount,
      finalTotal,
    };
  }

  const finalTotal = fallbackFinalTotal ?? merchandiseSubtotal;
  const voucherDiscount = Math.max(merchandiseSubtotal - finalTotal, 0);

  return {
    merchandiseSubtotal,
    shippingFee: 0,
    shippingDiscount: 0,
    voucherDiscount,
    finalTotal,
  };
}

function buildFallbackTimeline(status: OrderStatus, purchaseDate: string): OrderTrackingEvent[] {
  const orderPlacedAt = `${purchaseDate}T09:15:00`;

  if (status === "Cho xac nhan") {
    return [
      {
        time: orderPlacedAt,
        title: "Đơn hàng đã đặt",
        description: "Aromis đã tiếp nhận đơn hàng và đang chờ xác nhận tiếp theo.",
        state: "current",
      },
    ];
  }

  if (status === "Dang chuan bi") {
    return [
      {
        time: orderPlacedAt,
        title: "Đơn hàng đã đặt",
        description: "Thông tin đơn hàng đã được tiếp nhận thành công.",
        state: "completed",
      },
      {
        time: `${purchaseDate}T10:20:00`,
        title: "Đơn hàng đang được đóng gói",
        description: "Sản phẩm đang được kiểm tra và đóng gói trước khi bàn giao vận chuyển.",
        state: "current",
      },
    ];
  }

  if (status === "Dang giao") {
    return [
      {
        time: orderPlacedAt,
        title: "Đơn hàng đã đặt",
        description: "Thông tin đơn hàng đã được xác nhận thành công.",
        state: "completed",
      },
      {
        time: `${purchaseDate}T11:05:00`,
        title: "Đơn hàng đang trên đường giao",
        description: "Đơn hàng đã rời kho và dự kiến giao sớm.",
        state: "current",
      },
    ];
  }

  return [
    {
      time: orderPlacedAt,
      title: "Đơn hàng đã đặt",
      description: "Thông tin đơn hàng đã được tiếp nhận thành công.",
      state: "completed",
    },
    {
      time: `${purchaseDate}T10:40:00`,
      title: "Thanh toán đã được xác nhận",
      description: "Hệ thống đã xác nhận thanh toán cho đơn hàng này.",
      state: "completed",
    },
    {
      time: `${purchaseDate}T14:15:00`,
      title: "Đơn hàng đã giao thành công",
      description: "Khách hàng đã nhận đủ sản phẩm trong tình trạng nguyên vẹn.",
      state: "completed",
    },
  ];
}

function buildFulfillment(
  status: OrderStatus,
  purchaseDate: string,
  orderId: string,
  seed?: MockOrderSeed["fulfillment"]
): OrderFulfillment {
  if (seed) {
    return {
      providerName: seed.providerName,
      serviceLabel: seed.serviceLabel,
      trackingCode: seed.trackingCode,
      timeline: [...seed.timeline],
    };
  }

  return {
    providerName: "Aromis Express",
    serviceLabel: "Giao tiêu chuẩn",
    trackingCode: `ARO-${orderId}`,
    timeline: buildFallbackTimeline(status, purchaseDate),
  };
}

function normalizeOrderItem(rawItem: unknown): OrderHistoryItem | null {
  if (!rawItem || typeof rawItem !== "object") {
    return null;
  }

  const item = rawItem as Partial<OrderHistoryItem> & { productId?: string; quantity?: number };

  if (!item.productId || typeof item.quantity !== "number") {
    return null;
  }

  if (item.name && item.brand && item.volume && item.image !== undefined && typeof item.price === "number") {
    return {
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      brand: item.brand,
      volume: item.volume,
      image: item.image,
    };
  }

  return buildOrderItem(item.productId, item.quantity);
}

function normalizeOrderRecord(rawRecord: unknown): OrderHistoryRecord | null {
  if (!rawRecord || typeof rawRecord !== "object") {
    return null;
  }

  const record = rawRecord as Partial<OrderHistoryRecord>;

  if (
    typeof record.orderId !== "string" ||
    typeof record.purchaseDate !== "string" ||
    typeof record.status !== "string" ||
    typeof record.paymentMethod !== "string" ||
    typeof record.shippingAddress !== "string" ||
    !Array.isArray(record.items)
  ) {
    return null;
  }

  const items = record.items.map((item) => normalizeOrderItem(item)).filter(Boolean) as OrderHistoryItem[];
  const seed = mockOrderHistoryById.get(record.orderId);
  const paymentMethod = seed?.paymentMethod ?? normalizePaymentMethod(record.paymentMethod);
  const shippingAddress = seed?.shippingAddress ?? record.shippingAddress;
  const pricing = buildPricing(items, seed?.pricing, typeof record.totalAmount === "number" ? record.totalAmount : undefined);
  const shop = seed ? buildShop(seed, items[0]?.brand) : record.shop ?? buildShop(undefined, items[0]?.brand);
  const recipient = seed ? buildRecipient(shippingAddress, seed.recipient) : record.recipient ?? buildRecipient(shippingAddress);
  const paymentStatus = record.paymentStatus ?? seed?.paymentStatus ?? "Da thanh toan";
  const fulfillment = seed
    ? buildFulfillment(record.status as OrderStatus, record.purchaseDate, record.orderId, seed.fulfillment)
    : record.fulfillment ?? buildFulfillment(record.status as OrderStatus, record.purchaseDate, record.orderId);

  return {
    orderId: record.orderId,
    purchaseDate: record.purchaseDate,
    status: record.status as OrderStatus,
    paymentMethod,
    shippingAddress,
    items,
    shop,
    recipient,
    paymentStatus,
    pricing,
    fulfillment,
    detailNote: seed?.detailNote ?? record.detailNote,
    totalAmount: pricing.finalTotal,
  };
}

function normalizeOrderHistoryMap(orderHistoryMap: unknown) {
  if (!orderHistoryMap || typeof orderHistoryMap !== "object") {
    return {} as OrderHistoryMap;
  }

  return Object.fromEntries(
    Object.entries(orderHistoryMap as Record<string, unknown>).map(([userId, orders]) => [
      userId,
      Array.isArray(orders)
        ? sortOrders(orders.map((order) => normalizeOrderRecord(order)).filter(Boolean) as OrderHistoryRecord[])
        : [],
    ])
  ) as OrderHistoryMap;
}

function readOrderHistoryMap() {
  const currentMap = readStorage<Record<string, unknown>>(ORDER_STORAGE_KEY, {});

  if (Object.keys(currentMap).length > 0) {
    return normalizeOrderHistoryMap(currentMap);
  }

  const legacyMap = readStorage<Record<string, unknown>>(LEGACY_ORDER_STORAGE_KEY, {});

  if (Object.keys(legacyMap).length === 0) {
    return {} as OrderHistoryMap;
  }

  const normalizedLegacyMap = normalizeOrderHistoryMap(legacyMap);
  writeStorage(ORDER_STORAGE_KEY, normalizedLegacyMap);

  return normalizedLegacyMap;
}

function buildSeedOrders(userId: string) {
  return sortOrders(
    mockOrderHistory
      .filter((order) => order.userId === userId)
      .map((order) => {
        const items = order.items.map((item) => buildOrderItem(item.productId, item.quantity));
        const pricing = buildPricing(items, order.pricing);

        return {
          orderId: order.orderId,
          purchaseDate: order.purchaseDate,
          status: order.status,
          paymentMethod: order.paymentMethod,
          shippingAddress: order.shippingAddress,
          items,
          shop: buildShop(order),
          recipient: buildRecipient(order.shippingAddress, order.recipient),
          paymentStatus: order.paymentStatus,
          pricing,
          fulfillment: buildFulfillment(order.status, order.purchaseDate, order.orderId, order.fulfillment),
          detailNote: order.detailNote,
          totalAmount: pricing.finalTotal,
        };
      })
  );
}

export function subscribeToOrderHistoryStore(onStoreChange: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(ORDER_STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(ORDER_STORAGE_EVENT, onStoreChange);
  };
}

export function initializeOrderHistoryForUser(userId: string) {
  if (!userId || !isBrowser()) {
    return [] as OrderHistoryRecord[];
  }

  const orderHistoryMap = readOrderHistoryMap();

  if (userId in orderHistoryMap) {
    return sortOrders(orderHistoryMap[userId]);
  }

  const seededOrders = buildSeedOrders(userId);

  writeStorage(ORDER_STORAGE_KEY, {
    ...orderHistoryMap,
    [userId]: seededOrders,
  });

  return seededOrders;
}

export function saveOrdersByUserId(userId: string, orders: OrderHistoryRecord[]) {
  if (!userId) {
    return;
  }

  const orderHistoryMap = readOrderHistoryMap();

  writeStorage(ORDER_STORAGE_KEY, {
    ...orderHistoryMap,
    [userId]: sortOrders(orders),
  });
}

export function getOrdersByUserId(userId: string) {
  const orderHistoryMap = readOrderHistoryMap();

  return sortOrders(orderHistoryMap[userId] ?? []);
}