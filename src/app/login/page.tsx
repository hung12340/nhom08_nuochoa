'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/store/authStore';
import { signInWithGoogle, signInWithGitHub } from '@/lib/oauth';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOAuthLoading] = useState<'google' | 'github' | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({
        general: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setOAuthLoading('google');
    try {
      await signInWithGoogle();
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      console.error('Google login error:', error);
      setErrors({
        general: 'Đăng nhập Google thất bại',
      });
    } finally {
      setOAuthLoading(null);
    }
  };

  const handleGitHubLogin = async () => {
    setOAuthLoading('github');
    try {
      await signInWithGitHub();
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      console.error('GitHub login error:', error);
      setErrors({
        general: 'Đăng nhập GitHub thất bại',
      });
    } finally {
      setOAuthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-4 py-8">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>

      <div className="w-full max-w-md fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
            Đăng Nhập
          </h1>
          <p className="text-[#D4AF37]">
            Chào mừng quay lại Aromis
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-pulse">
            <p className="text-green-700 font-medium text-center">
              ✓ Đăng nhập thành công!
            </p>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium text-center">
              ✕ {errors.general}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition ${
                errors.email
                  ? 'border-red-500 bg-red-50'
                  : 'border-[#D4AF37]/30 bg-white'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Mật Khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu của bạn"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition ${
                errors.password
                  ? 'border-red-500 bg-red-50'
                  : 'border-[#D4AF37]/30 bg-white'
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-[#D4AF37] bg-white border-[#D4AF37]/30 rounded focus:ring-[#D4AF37]"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-[#1A1A1A]/70">
              Ghi nhớ tôi
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-[#b8962f] disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
        </form>

        {/* Social Login - Coming Soon */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D4AF37]/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#F9F9F9] text-[#1A1A1A]/70">Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={oauthLoading !== null}
              className="w-full flex items-center justify-center gap-2 bg-white border border-[#D4AF37]/30 text-[#1A1A1A] font-medium py-2 px-4 rounded-lg hover:bg-[#F9F9F9] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {oauthLoading === 'google' ? 'Đang...' : 'Google'}
            </button>
            <button
              type="button"
              onClick={handleGitHubLogin}
              disabled={oauthLoading !== null}
              className="w-full flex items-center justify-center gap-2 bg-white border border-[#D4AF37]/30 text-[#1A1A1A] font-medium py-2 px-4 rounded-lg hover:bg-[#F9F9F9] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              {oauthLoading === 'github' ? 'Đang...' : 'GitHub'}
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-[#1A1A1A]/70">
            Chưa có tài khoản?{' '}
            <Link
              href="/register"
              className="text-[#D4AF37] hover:text-[#b8962f] font-semibold underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 font-semibold mb-2">Tài khoản demo:</p>
          <p className="text-xs text-blue-800">Email: nguyenvana@gmail.com</p>
          <p className="text-xs text-blue-800">Mật khẩu: 123456</p>
        </div>
      </div>
    </div>
  );
}
