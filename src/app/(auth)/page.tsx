'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login, register, validateEmail } from '@/store/authStore';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  // Clear errors when switching modes
  useEffect(() => {
    setError('');
    setSuccess('');
    setErrors({});
  }, [isLogin]);

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
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password, name || email.split('@')[0]);
        setSuccess('✓ Đăng nhập thành công! Chuyển hướng...');
      } else {
        await register(email, password, name);
        setSuccess('✓ Đăng ký thành công! Chuyển hướng...');
      }

      // Redirect to home page after successful login/register
      setTimeout(() => {
        router.push('/');
      }, 1000);
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
    <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] via-white to-[#F9F9F9] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm border border-gray-100">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#1A1A1A] to-[#2d2d2d] text-white text-center py-16 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37] rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#D4AF37] rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h1 className="font-serif text-5xl mb-3 tracking-wide">
                {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
              </h1>
              <p className="text-[#D4AF37] text-sm tracking-widest font-semibold">
                ✨ AROMIS - ĐẲNG CẤP ✨
              </p>
            </div>
          </div>

          {/* Form Container */}
          <div className="p-8 md:p-10">
            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg animate-pulse">
                <p className="text-green-700 text-sm font-semibold">{success}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 text-sm font-semibold">⚠ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field (Register only) */}
              {!isLogin && (
                <div className="animate-fade-in">
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-3 uppercase tracking-[0.15em]">
                    👤 Họ và Tên
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập họ và tên"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all duration-300 ${
                      errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-xs mt-2 font-semibold">🔴 {errors.name}</p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-[#1A1A1A] mb-3 uppercase tracking-[0.15em]">
                  📧 Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all duration-300 ${
                    errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-2 font-semibold">🔴 {errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-[#1A1A1A] mb-3 uppercase tracking-[0.15em]">
                  🔐 Mật Khẩu
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu (6+ ký tự)"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all duration-300 ${
                    errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                {errors.password && (
                  <p className="text-red-600 text-xs mt-2 font-semibold">🔴 {errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field (Register only) */}
              {!isLogin && (
                <div className="animate-fade-in">
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-3 uppercase tracking-[0.15em]">
                    ✓ Xác Nhận Mật Khẩu
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all duration-300 ${
                      errors.confirmPassword
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-xs mt-2 font-semibold">🔴 {errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Remember Me Checkbox (Login only) */}
              {isLogin && (
                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 cursor-pointer accent-[#D4AF37] rounded border-gray-300"
                  />
                  <label htmlFor="rememberMe" className="ml-3 text-sm text-gray-700 cursor-pointer font-medium">
                    Ghi nhớ tôi
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 font-bold tracking-widest uppercase transition-all duration-300 rounded-lg text-sm mt-8 transform hover:scale-105 active:scale-95 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#D4AF37] to-[#c99e2e] text-[#1A1A1A] hover:shadow-lg shadow-md'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2">⏳</span>
                    Đang xử lý...
                  </span>
                ) : isLogin ? (
                  '🔓 ĐĂNG NHẬP'
                ) : (
                  '✨ ĐĂNG KÝ'
                )}
              </button>
            </form>

            {/* Toggle Auth Mode */}
            <div className="mt-10 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm mb-5 font-medium">
                {isLogin
                  ? '🆕 Chưa có tài khoản?'
                  : '👋 Đã có tài khoản?'}
              </p>
              <button
                onClick={handleToggleMode}
                className="inline-block text-[#D4AF37] font-bold hover:text-[#1A1A1A] transition-all duration-300 uppercase tracking-widest text-sm px-4 py-2 border-2 border-[#D4AF37] rounded-lg hover:bg-[#D4AF37]"
              >
                {isLogin ? '✨ ĐĂNG KÝ NGAY' : '🔓 ĐĂNG NHẬP'}
              </button>
            </div>

            {/* Back to Home */}
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="text-gray-500 text-xs hover:text-[#D4AF37] transition-colors uppercase tracking-wider font-semibold inline-flex items-center gap-2"
              >
                ← Quay về trang chủ
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Đăng nhập an toàn • Bảo mật 100% • Không chia sẻ dữ liệu</p>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
