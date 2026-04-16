'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Vui lòng nhập chủ đề';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung tin nhắn';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Nội dung tin nhắn phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const messages = JSON.parse(localStorage.getItem('contact-messages') || '[]');
      messages.push({
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('contact-messages', JSON.stringify(messages));

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] via-white to-[#F9F9F9] text-[#1A1A1A] font-sans">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#1A1A1A] to-[#2d2d2d] text-white py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-serif text-6xl md:text-7xl mb-5 tracking-wide drop-shadow-lg">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-[#D4AF37] tracking-widest uppercase text-sm font-semibold">
            ✨ Chúng tôi luôn sẵn lòng lắng nghe bạn ✨
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20">
        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-24 animate-fade-in">
          {/* Email Card */}
          <div className="group relative bg-white rounded-2xl shadow-xl p-10 text-center hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 border border-gray-100 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#c99e2e] rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-125 transition-transform duration-300 shadow-lg">
                <svg
                  className="w-12 h-12 text-[#1A1A1A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-3xl mb-3">📧 Email</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Gửi email cho chúng tôi bất kỳ lúc nào. Chúng tôi sẽ phản hồi trong 24 giờ.
              </p>
              <a
                href="mailto:info@aromis.com"
                className="inline-block text-[#D4AF37] font-bold hover:text-[#1A1A1A] transition-colors text-lg border-b-2 border-[#D4AF37] pb-1"
              >
                info@aromis.com
              </a>
            </div>
          </div>

          {/* Phone Card */}
          <div className="group relative bg-white rounded-2xl shadow-xl p-10 text-center hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 border border-gray-100 overflow-hidden delay-100">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#c99e2e] rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-125 transition-transform duration-300 shadow-lg">
                <svg
                  className="w-12 h-12 text-[#1A1A1A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-3xl mb-3">📱 Điện Thoại</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Gọi cho chúng tôi từ thứ 2 đến thứ 6, 9AM - 6PM
              </p>
              <a
                href="tel:+84123456789"
                className="inline-block text-[#D4AF37] font-bold hover:text-[#1A1A1A] transition-colors text-lg border-b-2 border-[#D4AF37] pb-1"
              >
                +84 (123) 456-789
              </a>
            </div>
          </div>

          {/* Location Card */}
          <div className="group relative bg-white rounded-2xl shadow-xl p-10 text-center hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 border border-gray-100 overflow-hidden delay-200">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37] to-[#c99e2e] rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-125 transition-transform duration-300 shadow-lg">
                <svg
                  className="w-12 h-12 text-[#1A1A1A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-3xl mb-3">📍 Địa Chỉ</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Ghé thăm cửa hàng phiên lưu của chúng tôi
              </p>
              <p className="text-[#D4AF37] font-bold text-lg border-b-2 border-[#D4AF37] pb-1 inline-block">
                123 Ngô Tất Tố, Hà Nội
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form & Map */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100 animate-fade-in">
            <h2 className="font-serif text-4xl mb-2 text-[#1A1A1A]">
              Gửi Tin Nhắn
            </h2>
            <p className="text-gray-600 mb-8 text-sm">Để lại lời nhắn cho chúng tôi</p>

            {submitted && (
              <div className="mb-8 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg animate-pulse">
                <p className="text-green-700 font-bold text-sm">
                  ✓ Cảm ơn bạn! Chúng tôi sẽ trả lời trong 24 giờ.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-8 p-5 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-bold text-sm">⚠ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-3 uppercase tracking-[0.15em]">
                  👤 Họ và Tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all duration-300 ${
                    errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-2 font-semibold">🔴 {errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-3 uppercase tracking-[0.15em]">
                  📧 Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all duration-300 ${
                    errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-2 font-semibold">🔴 {errors.email}</p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-3 uppercase tracking-[0.15em]">
                  💬 Chủ Đề
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Nhập chủ đề"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all duration-300 ${
                    errors.subject ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.subject && (
                  <p className="text-red-600 text-xs mt-2 font-semibold">🔴 {errors.subject}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-3 uppercase tracking-[0.15em]">
                  📝 Nội Dung
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Nhập nội dung tin nhắn (tối thiểu 10 ký tự)"
                  rows={6}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all duration-300 resize-none ${
                    errors.message ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.message && (
                  <p className="text-red-600 text-xs mt-2 font-semibold">🔴 {errors.message}</p>
                )}
              </div>

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
                    Đang gửi...
                  </span>
                ) : (
                  '✉️ GỬI TIN NHẮN'
                )}
              </button>
            </form>
          </div>

          {/* Google Maps Embed */}
          <div className="rounded-2xl shadow-xl overflow-hidden h-full min-h-[500px] border border-gray-100 animate-fade-in delay-100">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '500px' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.546238281829!2d105.77089532346917!3d20.99725108062129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acec381fce4f%3A0x5f0a0f5a5f5a5f5a!2s123%20Ngo%20Tat%20To%2C%20Hoan%20Kiem%2C%20Ha%20Noi!5e0!3m2!1sen!2s!4v1712000000000&z=18"
            />
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-20">
          <Link
            href="/"
            className="inline-block text-gray-600 hover:text-[#D4AF37] transition-colors uppercase tracking-wider font-semibold hover:-translate-x-1 duration-300"
          >
            ← Quay về trang chủ
          </Link>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}
