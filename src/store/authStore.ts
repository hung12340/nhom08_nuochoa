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

// Login function
export const login = async (
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

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name,
  };

  const state: AuthState = {
    user,
    isLoggedIn: true,
    rememberMe: false,
  };

  saveAuthState(state);
  return user;
};

// Register function
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

  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name,
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
