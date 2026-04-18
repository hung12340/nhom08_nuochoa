import productsData from "@/lib/data.json";

export type SocialProvider = "google" | "github";
export type AuthProvider = "credentials" | SocialProvider;

export type StoredUser = {
  email: string;
  password: string;
  createdAt: string;
  provider?: AuthProvider;
};

export type OrderStatus =
  | "Chờ xác nhận"
  | "Đang chuẩn bị"
  | "Đang giao"
  | "Đã hoàn thành";

export type OrderHistoryItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  brand: string;
  volume: string;
};

export type OrderHistory = {
  orderId: string;
  purchaseDate: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderHistoryItem[];
};

type OrderHistoryMap = Record<string, OrderHistory[]>;

type ProductRecord = {
  id: string;
  name: string;
  brand: string;
  price: number;
  volume: string;
  images: string[];
};

const products = productsData as ProductRecord[];

const socialAuthAccounts: Record<SocialProvider, { email: string; password: string }> = {
  google: {
    email: "google.member@aromis.local",
    password: "google-oauth",
  },
  github: {
    email: "github.member@aromis.local",
    password: "github-oauth",
  },
};

export const STORAGE_EVENT_NAME = "aromis-storage";

export const LOCAL_STORAGE_KEYS = {
  users: "aromis_users",
  rememberedEmail: "aromis_remembered_email",
  currentUser: "aromis_current_user",
  orders: "aromis_order_history",
} as const;

function isBrowser() {
  return typeof window !== "undefined";
}

function emitStorageChange() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(STORAGE_EVENT_NAME));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readStorage<T>(key: string, fallback: T): T {
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
  emitStorageChange();
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
    image: product?.images[0] ?? "",
    brand: product?.brand ?? "Aromis",
    volume: product?.volume ?? "100ml",
  };
}

function calculateOrderTotal(items: OrderHistoryItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

export function getStoredUsers() {
  return readStorage<StoredUser[]>(LOCAL_STORAGE_KEYS.users, []);
}

export function registerStoredUser(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const users = getStoredUsers();

  const isDuplicate = users.some((user) => user.email === normalizedEmail);

  if (isDuplicate) {
    return { success: false as const, message: "Email này đã được đăng ký." };
  }

  const nextUsers = [
    ...users,
    {
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
      provider: "credentials",
    },
  ];

  writeStorage(LOCAL_STORAGE_KEYS.users, nextUsers);

  return { success: true as const };
}

export function authenticateStoredUser(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const users = getStoredUsers();
  const matchedUser = users.find(
    (user) => user.email === normalizedEmail && user.password === password
  );

  if (!matchedUser) {
    return null;
  }

  return matchedUser;
}

export function signInWithSocialProvider(provider: SocialProvider) {
  const account = socialAuthAccounts[provider];
  const users = getStoredUsers();
  const existingUser = users.find((user) => user.email === account.email);

  if (!existingUser) {
    writeStorage(LOCAL_STORAGE_KEYS.users, [
      ...users,
      {
        email: account.email,
        password: account.password,
        createdAt: new Date().toISOString(),
        provider,
      },
    ]);
  }

  setCurrentUserEmail(account.email);

  return account.email;
}

export function setRememberedEmail(email: string | null) {
  if (!isBrowser()) {
    return;
  }

  if (!email) {
    window.localStorage.removeItem(LOCAL_STORAGE_KEYS.rememberedEmail);
    emitStorageChange();
    return;
  }

  window.localStorage.setItem(LOCAL_STORAGE_KEYS.rememberedEmail, normalizeEmail(email));
  emitStorageChange();
}

export function getRememberedEmail() {
  if (!isBrowser()) {
    return "";
  }

  return window.localStorage.getItem(LOCAL_STORAGE_KEYS.rememberedEmail) ?? "";
}

export function setCurrentUserEmail(email: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(LOCAL_STORAGE_KEYS.currentUser, normalizeEmail(email));
  emitStorageChange();
}

export function getCurrentUserEmail() {
  if (!isBrowser()) {
    return "";
  }

  return window.localStorage.getItem(LOCAL_STORAGE_KEYS.currentUser) ?? "";
}

export function clearCurrentUserEmail() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(LOCAL_STORAGE_KEYS.currentUser);
  emitStorageChange();
}

const defaultOrderBlueprints = [
  {
    orderId: "ARM-999",
    purchaseDate: "2026-04-12",
    status: "Đã hoàn thành" as const,
    items: [
      { productId: "9", quantity: 1 },
      { productId: "11", quantity: 1 },
    ],
  },
  {
    orderId: "ARM-1001",
    purchaseDate: "2026-04-15",
    status: "Đang giao" as const,
    items: [{ productId: "3", quantity: 1 }],
  },
  {
    orderId: "ARM-1002",
    purchaseDate: "2026-04-18",
    status: "Chờ xác nhận" as const,
    items: [
      { productId: "4", quantity: 1 },
      { productId: "12", quantity: 1 },
    ],
  },
];

function createDefaultOrders() {
  return defaultOrderBlueprints.map((order) => {
    const items = order.items.map((item) => buildOrderItem(item.productId, item.quantity));

    return {
      orderId: order.orderId,
      purchaseDate: order.purchaseDate,
      status: order.status,
      items,
      totalAmount: calculateOrderTotal(items),
    };
  });
}

export function getOrderHistory(userEmail: string) {
  const normalizedEmail = normalizeEmail(userEmail);
  const orderHistoryMap = readStorage<OrderHistoryMap>(LOCAL_STORAGE_KEYS.orders, {});

  return orderHistoryMap[normalizedEmail] ?? [];
}

export function ensureOrderHistory(userEmail: string) {
  const normalizedEmail = normalizeEmail(userEmail);
  const orderHistoryMap = readStorage<OrderHistoryMap>(LOCAL_STORAGE_KEYS.orders, {});
  const existingOrders = orderHistoryMap[normalizedEmail];

  if (existingOrders && existingOrders.length > 0) {
    return existingOrders;
  }

  const nextOrders = createDefaultOrders();
  writeStorage(LOCAL_STORAGE_KEYS.orders, {
    ...orderHistoryMap,
    [normalizedEmail]: nextOrders,
  });
  return nextOrders;
}

export function saveOrderHistory(userEmail: string, orders: OrderHistory[]) {
  const normalizedEmail = normalizeEmail(userEmail);
  const orderHistoryMap = readStorage<OrderHistoryMap>(LOCAL_STORAGE_KEYS.orders, {});

  writeStorage(LOCAL_STORAGE_KEYS.orders, {
    ...orderHistoryMap,
    [normalizedEmail]: orders,
  });
}

export function resetOrderHistory(userEmail: string) {
  const normalizedEmail = normalizeEmail(userEmail);
  const orderHistoryMap = readStorage<OrderHistoryMap>(LOCAL_STORAGE_KEYS.orders, {});
  const nextOrders = createDefaultOrders();

  writeStorage(LOCAL_STORAGE_KEYS.orders, {
    ...orderHistoryMap,
    [normalizedEmail]: nextOrders,
  });

  return nextOrders;
}