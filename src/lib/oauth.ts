import { signIn as nextAuthSignIn } from 'next-auth/react';

export const signInWithGoogle = async () => {
  try {
    // Mock Google login
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const mockUser = {
      id: 'google-' + Math.random().toString(36).substr(2, 9),
      email: 'user.google@gmail.com',
      name: 'Google User',
    };

    // Simulate storing to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'auth-storage',
        JSON.stringify({
          user: mockUser,
          isLoggedIn: true,
          rememberMe: false,
        })
      );
    }

    return mockUser;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

export const signInWithGitHub = async () => {
  try {
    // Mock GitHub login
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const mockUser = {
      id: 'github-' + Math.random().toString(36).substr(2, 9),
      email: 'user.github@github.com',
      name: 'GitHub User',
    };

    // Simulate storing to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'auth-storage',
        JSON.stringify({
          user: mockUser,
          isLoggedIn: true,
          rememberMe: false,
        })
      );
    }

    return mockUser;
  } catch (error) {
    console.error('GitHub login error:', error);
    throw error;
  }
};
