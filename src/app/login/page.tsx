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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50 flex items-center justify-center px-4 py-8">
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
          <h1 className="text-4xl font-bold text-amber-900 mb-2 font-sans">
            Đăng Nhập
          </h1>
          <p className="text-amber-700">
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
            <label htmlFor="email" className="block text-sm font-medium text-amber-900 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                errors.email
                  ? 'border-red-500 bg-red-50'
                  : 'border-amber-200 bg-white'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-amber-900 mb-2">
              Mật Khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu của bạn"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                errors.password
                  ? 'border-red-500 bg-red-50'
                  : 'border-amber-200 bg-white'
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
              className="w-4 h-4 text-amber-600 bg-white border-amber-300 rounded focus:ring-amber-500"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-amber-700">
              Ghi nhớ tôi
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
          </button>
        </form>

        {/* Social Login - Coming Soon */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-amber-50 text-amber-700">Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={oauthLoading !== null}
              className="w-full bg-white border border-amber-200 text-amber-900 font-medium py-2 px-4 rounded-lg hover:bg-amber-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === 'google' ? 'Đang xử lý...' : 'Google'}
            </button>
            <button
              type="button"
              onClick={handleGitHubLogin}
              disabled={oauthLoading !== null}
              className="w-full bg-white border border-amber-200 text-amber-900 font-medium py-2 px-4 rounded-lg hover:bg-amber-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === 'github' ? 'Đang xử lý...' : 'GitHub'}
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-amber-700">
            Chưa có tài khoản?{' '}
            <Link
              href="/register"
              className="text-amber-600 hover:text-amber-700 font-semibold underline"
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
