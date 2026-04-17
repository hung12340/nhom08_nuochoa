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
let MOCK_USERS = [
  {
    id: 'user1',
    email: 'nguyenvana@gmail.com',
    password: '123456',
    name: 'Nguy?n Vãn A',
  },
  {
    id: 'user2',
    email: 'tranthib@gmail.com',
    password: '123456',
    name: 'Tr?n Th? B',
  },
  {
    id: 'user3',
    email: 'phamvanc@gmail.com',
    password: '123456',
    name: 'Ph?m Vãn C',
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

// Login function - ki?m tra t? users.json
export const login = async (
  email: string,
  password: string
): Promise<User> => {
  if (!validateEmail(email)) {
    throw new Error('Email không h?p l?');
  }

  if (password.length < 6) {
    throw new Error('M?t kh?u ph?i có ít nh?t 6 k? t?');
  }

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Ki?m tra user t? MOCK_USERS
  const foundUser = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );

  if (!foundUser) {
    throw new Error('Email ho?c m?t kh?u không ðúng');
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

// Register function - cho phép ðãng k? ngý?i dùng m?i
export const register = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  if (!validateEmail(email)) {
    throw new Error('Email không h?p l?');
  }

  if (password.length < 6) {
    throw new Error('M?t kh?u ph?i có ít nh?t 6 k? t?');
  }

  if (!name.trim()) {
    throw new Error('Vui l?ng nh?p h? và tên');
  }

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Check if email already exists
  const existingUser = MOCK_USERS.find((u) => u.email === email);
  if (existingUser) {
    throw new Error('Email này ð? ðý?c ðãng k?');
  }

  // Create new user
  const newUser: User & { password: string } = {
    id: `user${MOCK_USERS.length + 1}`,
    email,
    password,
    name,
  };

  // Add to mock database
  MOCK_USERS.push(newUser);

  const user: User = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
  };

  const state: AuthState = {
    user,
    isLoggedIn: true,
    rememberMe: false,
  };

  saveAuthState(state);
  return user;
};

// Logout function
export const logout = (): void => {
  saveAuthState({
    user: null,
    isLoggedIn: false,
    rememberMe: false,
  });
};
