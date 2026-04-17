export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  rememberMe: boolean;
}

// Mock users database
const MOCK_USERS = [
  {
    id: 'user1',
    email: 'nguyenvana@gmail.com',
    password: '123456',
    name: 'Nguyễn Văn A',
  },
  {
    id: 'user2',
    email: 'tranthib@gmail.com',
    password: '123456',
    name: 'Trần Thị B',
  },
  {
    id: 'user3',
    email: 'phamvanc@gmail.com',
    password: '123456',
    name: 'Phạm Văn C',
  },
];

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get auth state from localStorage
export const getAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { user: null, isLoggedIn: false, rememberMe: false };
  }

  const stored = localStorage.getItem('auth-storage');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      return { user: null, isLoggedIn: false, rememberMe: false };
    }
  }

  return { user: null, isLoggedIn: false, rememberMe: false };
};

// Save auth state to localStorage
export const saveAuthState = (state: AuthState): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth-storage', JSON.stringify(state));
  }
};

// Login function - kiểm tra từ users.json
export const login = async (
  email: string,
  password: string
): Promise<User> => {
  if (!validateEmail(email)) {
    throw new Error('Email không hợp lệ');
  }

  if (password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
  }

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Kiểm tra user từ MOCK_USERS
  const foundUser = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!foundUser) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  const user: User = {
    id: foundUser.id,
    email: foundUser.email,
    name: foundUser.name,
  };

  const state: AuthState = {
    user,
    isLoggedIn: true,
    rememberMe: false,
  };

  saveAuthState(state);
  return user;
};

// Register function - không cho phép đăng ký, chỉ những tài khoản trong users.json
export const register = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  if (!validateEmail(email)) {
    throw new Error('Email không hợp lệ');
  }

  if (password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
  }

  if (!name.trim()) {
    throw new Error('Vui lòng nhập họ và tên');
  }

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  throw new Error(
    'Tính năng đăng ký chưa được hỗ trợ. Vui lòng liên hệ quản trị viên.'
  );
};

// Logout function
export const logout = (): void => {
  saveAuthState({
    user: null,
    isLoggedIn: false,
    rememberMe: false,
  });
};
