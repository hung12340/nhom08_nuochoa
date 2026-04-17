export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  userId: string;
  purchaseDate: string;
  status: 'Chờ xác nhận' | 'Đang giao' | 'Đã hoàn thành';
  totalAmount: number;
  items: OrderItem[];
}

export interface OrderState {
  orders: Order[];
}

// Mock orders database
const MOCK_ORDERS: Order[] = [
  {
    orderId: 'ORD001',
    userId: 'user1',
    purchaseDate: '2024-04-10',
    status: 'Đã hoàn thành',
    totalAmount: 450000,
    items: [
      {
        name: 'Tinh dầu Hoa Hồng Premium',
        quantity: 2,
        price: 225000,
      },
    ],
  },
  {
    orderId: 'ORD002',
    userId: 'user1',
    purchaseDate: '2024-04-12',
    status: 'Đang giao',
    totalAmount: 350000,
    items: [
      {
        name: 'Tinh dầu Hoa Cúc Chamomile',
        quantity: 1,
        price: 350000,
      },
    ],
  },
  {
    orderId: 'ORD003',
    userId: 'user1',
    purchaseDate: '2024-04-14',
    status: 'Chờ xác nhận',
    totalAmount: 280000,
    items: [
      {
        name: 'Tinh dầu Bạc Hà',
        quantity: 1,
        price: 280000,
      },
    ],
  },
  {
    orderId: 'ORD004',
    userId: 'user2',
    purchaseDate: '2024-04-09',
    status: 'Đã hoàn thành',
    totalAmount: 520000,
    items: [
      {
        name: 'Tinh dầu Hoa Hồng Premium',
        quantity: 1,
        price: 350000,
      },
      {
        name: 'Tinh dầu Bạc Hà',
        quantity: 1,
        price: 170000,
      },
    ],
  },
  {
    orderId: 'ORD005',
    userId: 'user2',
    purchaseDate: '2024-04-13',
    status: 'Đang giao',
    totalAmount: 400000,
    items: [
      {
        name: 'Tinh dầu Hoa Cúc Chamomile',
        quantity: 1,
        price: 400000,
      },
    ],
  },
  {
    orderId: 'ORD006',
    userId: 'user3',
    purchaseDate: '2024-04-11',
    status: 'Đã hoàn thành',
    totalAmount: 600000,
    items: [
      {
        name: 'Bộ tinh dầu Aromis 3 lọ',
        quantity: 1,
        price: 600000,
      },
    ],
  },
];

// Get orders from localStorage
export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const stored = localStorage.getItem('order-history');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      return [];
    }
  }

  return [];
};

// Get orders by userId
export const getOrdersByUserId = (userId: string): Order[] => {
  const orders = getOrders();
  return orders.filter((order) => order.userId === userId);
};

// Save orders to localStorage
export const saveOrders = (orders: Order[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('order-history', JSON.stringify(orders));
  }
};

// Add new order
export const addOrder = (order: Order): void => {
  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);
};

// Update order status
export const updateOrderStatus = (
  orderId: string,
  status: Order['status']
): void => {
  const orders = getOrders();
  const order = orders.find((o) => o.orderId === orderId);
  if (order) {
    order.status = status;
    saveOrders(orders);
  }
};

// Get order by ID
export const getOrderById = (orderId: string): Order | undefined => {
  const orders = getOrders();
  return orders.find((o) => o.orderId === orderId);
};

// Generate order ID
export const generateOrderId = (): string => {
  return `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Create initial mock orders for demo
export const initializeMockOrders = (): void => {
  const orders = getOrders();
  if (orders.length === 0) {
    saveOrders(MOCK_ORDERS);
  }
};
