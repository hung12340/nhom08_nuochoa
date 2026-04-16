export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  purchaseDate: string;
  status: 'Chờ xác nhận' | 'Đang giao' | 'Đã hoàn thành';
  totalAmount: number;
  items: OrderItem[];
}

export interface OrderState {
  orders: Order[];
}

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
  return `ARM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Create initial mock orders for demo
export const initializeMockOrders = (): void => {
  const orders = getOrders();
  if (orders.length === 0) {
    const mockOrders: Order[] = [
      {
        orderId: 'ARM-001',
        purchaseDate: '2026-04-12',
        status: 'Đã hoàn thành',
        totalAmount: 9000000,
        items: [
          {
            productId: '1',
            name: 'Bleu de Chanel',
            quantity: 2,
            price: 4500000,
          },
        ],
      },
      {
        orderId: 'ARM-002',
        purchaseDate: '2026-04-10',
        status: 'Đang giao',
        totalAmount: 3480000,
        items: [
          {
            productId: '2',
            name: 'Dior Sauvage EDP',
            quantity: 1,
            price: 3480000,
          },
        ],
      },
      {
        orderId: 'ARM-003',
        purchaseDate: '2026-04-05',
        status: 'Chờ xác nhận',
        totalAmount: 7960000,
        items: [
          {
            productId: '4',
            name: 'Dior Jadore EDP',
            quantity: 2,
            price: 3980000,
          },
        ],
      },
    ];
    saveOrders(mockOrders);
  }
};
