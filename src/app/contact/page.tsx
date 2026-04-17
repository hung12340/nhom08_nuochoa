'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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

    if (!formData.name.trim()) {
      newErrors.name = 'Họ tên là bắt buộc';
    }

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Chủ đề là bắt buộc';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Nội dung là bắt buộc';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Nội dung phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Save to localStorage
      const messages = JSON.parse(
        localStorage.getItem('contact-messages') || '[]'
      );
      messages.push({
        id: Date.now(),
        ...formData,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('contact-messages', JSON.stringify(messages));

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Contact form error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
        .stagger-1 {
          animation: fadeIn 0.6s ease-out 0.1s backwards;
        }
        .stagger-2 {
          animation: fadeIn 0.6s ease-out 0.2s backwards;
        }
        .stagger-3 {
          animation: fadeIn 0.6s ease-out 0.3s backwards;
        }
      `}</style>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-3">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-amber-100 text-lg">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Email Card */}
          <div className="stagger-1 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-8 text-center">
            <div className="text-5xl mb-4">✉️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600 mb-3">Gửi thư cho chúng tôi</p>
            <a
              href="mailto:info@aromis.com"
              className="text-amber-600 font-semibold hover:text-amber-700 transition"
            >
              info@aromis.com
            </a>
          </div>

          {/* Phone Card */}
          <div className="stagger-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-8 text-center">
            <div className="text-5xl mb-4">📞</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Điện Thoại</h3>
            <p className="text-gray-600 mb-3">Gọi cho chúng tôi</p>
            <a
              href="tel:+84912345678"
              className="text-amber-600 font-semibold hover:text-amber-700 transition"
            >
              +84 (912) 345-678
            </a>
          </div>

          {/* Address Card */}
          <div className="stagger-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 p-8 text-center">
            <div className="text-5xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Địa Chỉ</h3>
            <p className="text-gray-600">
              Số 1 Đ. Võ Văn Ngân, Linh Chiểu
              <br />
              Thủ Đức, Hồ Chí Minh, Việt Nam
            </p>
          </div>
        </div>

        {/* Form & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Gửi Tin Nhắn Cho Chúng Tôi
            </h2>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">
                  ✓ Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và Tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">✕ {errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">✕ {errors.email}</p>
                )}
              </div>

              {/* Subject Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chủ Đề
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Tiêu đề của bạn"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition ${
                    errors.subject ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">✕ {errors.subject}</p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội Dung
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Nội dung tin nhắn của bạn..."
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition resize-none ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">✕ {errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95"
              >
                {loading ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
              </button>
            </form>
          </div>

          {/* Map */}
          <div className="fade-in h-full">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Vị Trí</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-96 md:h-full">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.2521!2d106.7579!3d10.8059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529e1bb00001%3A0x9999999999999!2s1%20Duong%20Vo%20Van%20Ngan%2C%20Linh%20Chieu%2C%20Thu%20Duc%2C%20Ho%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1713361200000"
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
