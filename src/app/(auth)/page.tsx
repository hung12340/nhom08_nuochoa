'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login, register, validateEmail } from '@/store/authStore';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Form validation state
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!isLogin && !name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    }

    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không trùng khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password, name || email.split('@')[0]);
      } else {
        await register(email, password, name);
      }

      // Redirect to home page after successful login/register
      setTimeout(() => {
        router.push('/');
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setErrors({});
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-[#1A1A1A] text-white text-center py-12">
            <h1 className="font-serif text-4xl mb-2 tracking-wide">
              {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
            </h1>
            <p className="text-[#D4AF37] text-sm tracking-widest font-medium">
              AROMIS
            </p>
          </div>

          {/* Form Container */}
          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field (Register only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wider">
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập họ và tên"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-xs mt-2 font-medium">
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-2 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wider">
                  Mật Khẩu
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all ${
                    errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.password && (
                  <p className="text-red-600 text-xs mt-2 font-medium">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field (Register only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wider">
                    Xác Nhận Mật Khẩu
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all ${
                      errors.confirmPassword
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-xs mt-2 font-medium">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Remember Me Checkbox (Login only) */}
              {isLogin && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 cursor-pointer accent-[#D4AF37]"
                  />
                  <label htmlFor="rememberMe" className="ml-3 text-sm text-gray-600 cursor-pointer">
                    Ghi nhớ tôi
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 font-bold tracking-widest uppercase transition-all duration-300 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#D4AF37] text-[#1A1A1A] hover:bg-[#c99e2e] shadow-md hover:shadow-lg'
                }`}
              >
                {loading ? 'Đang xử lý...' : isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
              </button>
            </form>

            {/* Toggle Auth Mode */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm mb-4">
                {isLogin
                  ? 'Chưa có tài khoản?'
                  : 'Đã có tài khoản?'}
              </p>
              <button
                onClick={handleToggleMode}
                className="text-[#D4AF37] font-semibold hover:text-[#1A1A1A] transition-colors uppercase tracking-wider text-sm"
              >
                {isLogin ? 'Đăng Ký Ngay' : 'Đăng Nhập'}
              </button>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-gray-500 text-xs hover:text-[#D4AF37] transition-colors uppercase tracking-wider"
              >
                ← Quay về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
