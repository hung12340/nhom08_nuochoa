"use client";

import { FormEvent, useState } from "react";

type ContactFormState = {
  fullName: string;
  email: string;
  content: string;
};

type ContactErrors = Partial<Record<keyof ContactFormState, string>>;

const initialFormState: ContactFormState = {
  fullName: "",
  email: "",
  content: "",
};

const CONTACT_MESSAGES_KEY = "aromis_contact_messages";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
}

function saveContactMessage(message: ContactFormState & { createdAt: string }) {
  if (typeof window === "undefined") {
    return;
  }

  const currentMessages = window.localStorage.getItem(CONTACT_MESSAGES_KEY);
  const parsedMessages = currentMessages ? JSON.parse(currentMessages) : [];

  window.localStorage.setItem(
    CONTACT_MESSAGES_KEY,
    JSON.stringify([message, ...parsedMessages])
  );
}

function validateContactForm(values: ContactFormState) {
  const errors: ContactErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ tên.";
  }

  if (!values.email.trim()) {
    errors.email = "Vui lòng nhập email.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Email chưa đúng định dạng.";
  }

  if (!values.content.trim()) {
    errors.content = "Vui lòng nhập nội dung lời nhắn.";
  }

  return errors;
}

export default function ContactPage() {
  const [formValues, setFormValues] = useState<ContactFormState>(initialFormState);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFieldChange = (field: keyof ContactFormState, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
    setIsSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateContactForm(formValues);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    saveContactMessage({
      ...formValues,
      createdAt: new Date().toISOString(),
    });

    setFormValues(initialFormState);
    setIsSubmitted(true);
  };

  return (
    <div className="bg-[#F9F9F9] text-[#1A1A1A]">
      <section className="relative overflow-hidden bg-[#1A1A1A] px-6 py-20 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 opacity-20">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://orchard.vn/wp-content/uploads/2023/08/parfums-de-marly-delina_3.jpg')",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#D4AF37]">Contact Aromis</p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-tight sm:text-6xl">
            Liên hệ để Aromis lắng nghe nhu cầu mùi hương của bạn.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/72">
            Aromis luôn trân trọng mọi phản hồi, yêu cầu tư vấn và thắc mắc liên quan đến sản phẩm, đơn hàng hoặc trải nghiệm mua
            sắm. Đội ngũ hỗ trợ sẵn sàng đồng hành cùng bạn với phong cách phục vụ tinh tế, rõ ràng và chuyên nghiệp.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="border border-[#1A1A1A]/8 bg-white p-7 shadow-[0_18px_50px_rgba(26,26,26,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Điểm chạm Aromis</p>
              <h2 className="mt-4 font-serif text-3xl">Không gian tư vấn dành cho những trải nghiệm hương thơm tinh tế.</h2>
              <p className="mt-4 text-sm leading-7 text-[#1A1A1A]/68 sm:text-base">
                Từ tư vấn lựa chọn mùi hương, hỗ trợ thông tin sản phẩm đến các vấn đề sau mua sắm, Aromis cam kết tiếp nhận yêu
                cầu với sự tận tâm, chỉn chu và chuẩn mực dịch vụ đồng nhất trên toàn bộ website.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="border border-[#1A1A1A]/8 bg-[#FCFBF8] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Khu vực</p>
                <p className="mt-3 font-serif text-2xl">TP. Thủ Đức</p>
                <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/68">Vị trí tham chiếu tại khu vực trung tâm, thuận tiện cho việc kết nối và hỗ trợ khách hàng.</p>
              </div>

              <div className="border border-[#1A1A1A]/8 bg-[#FCFBF8] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Thời gian hỗ trợ</p>
                <p className="mt-3 font-serif text-2xl">09:00 - 21:30</p>
                <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/68">Aromis ưu tiên phản hồi nhanh trong khung giờ làm việc để đảm bảo trải nghiệm hỗ trợ liền mạch và chuyên nghiệp.</p>
              </div>

              <div className="border border-[#1A1A1A]/8 bg-[#FCFBF8] p-6 sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Gợi ý nội dung liên hệ</p>
                <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/68 sm:text-base">
                  Bạn có thể dùng form bên cạnh để mô phỏng các nhu cầu như tư vấn chọn mùi hương, hỏi tình trạng đơn hàng, hoặc
                  nhắn về trải nghiệm mua sắm trên website Aromis.
                </p>
              </div>
            </div>
          </div>

          <div className="border border-[#1A1A1A]/8 bg-white p-7 shadow-[0_24px_80px_rgba(26,26,26,0.08)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Form liên hệ</p>
            <h2 className="mt-4 font-serif text-4xl">Gửi lời nhắn cho Aromis</h2>
            <p className="mt-4 text-sm leading-7 text-[#1A1A1A]/68 sm:text-base">
              Họ tên, email và nội dung lời nhắn sẽ được kiểm tra hợp lệ trước khi tiếp nhận để đảm bảo thông tin liên hệ rõ ràng và chính xác.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              <div>
                <label htmlFor="contact-fullname" className="mb-2 block text-sm font-semibold">
                  Họ tên
                </label>
                <input
                  id="contact-fullname"
                  type="text"
                  value={formValues.fullName}
                  onChange={(event) => handleFieldChange("fullName", event.target.value)}
                  placeholder="Nguyễn Văn A"
                  aria-invalid={Boolean(errors.fullName)}
                  className={`w-full border px-4 py-3 outline-none transition ${
                    errors.fullName
                      ? "border-red-500 bg-red-50/60 text-red-700"
                      : "border-[#1A1A1A]/12 bg-[#FCFBF8] focus:border-[#D4AF37]"
                  }`}
                />
                {errors.fullName ? <p className="mt-2 text-sm text-red-600">{errors.fullName}</p> : null}
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={formValues.email}
                  onChange={(event) => handleFieldChange("email", event.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  className={`w-full border px-4 py-3 outline-none transition ${
                    errors.email
                      ? "border-red-500 bg-red-50/60 text-red-700"
                      : "border-[#1A1A1A]/12 bg-[#FCFBF8] focus:border-[#D4AF37]"
                  }`}
                />
                {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email}</p> : null}
              </div>

              <div>
                <label htmlFor="contact-content" className="mb-2 block text-sm font-semibold">
                  Nội dung
                </label>
                <textarea
                  id="contact-content"
                  rows={6}
                  value={formValues.content}
                  onChange={(event) => handleFieldChange("content", event.target.value)}
                  placeholder="Aromis có thể hỗ trợ gì cho bạn hôm nay?"
                  aria-invalid={Boolean(errors.content)}
                  className={`w-full resize-none border px-4 py-3 outline-none transition ${
                    errors.content
                      ? "border-red-500 bg-red-50/60 text-red-700"
                      : "border-[#1A1A1A]/12 bg-[#FCFBF8] focus:border-[#D4AF37]"
                  }`}
                />
                {errors.content ? <p className="mt-2 text-sm text-red-600">{errors.content}</p> : null}
              </div>

              {isSubmitted ? (
                <div className="border border-[#D4AF37]/45 bg-[#D4AF37]/10 px-4 py-3 text-sm text-[#7F5B00]">
                  Aromis đã tiếp nhận lời nhắn của bạn. Cảm ơn bạn đã dành thời gian kết nối cùng thương hiệu.
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full bg-[#1A1A1A] px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#D4AF37] hover:text-[#1A1A1A]"
              >
                Gửi lời nhắn
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 overflow-hidden border border-[#1A1A1A]/8 bg-white shadow-[0_20px_60px_rgba(26,26,26,0.06)]">
          <div className="border-b border-[#1A1A1A]/8 px-6 py-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">Google Maps</p>
            <h2 className="mt-3 font-serif text-3xl">Vị trí tham chiếu cho phần liên hệ</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#1A1A1A]/68 sm:text-base">
              Bản đồ được tích hợp nhằm giúp khách hàng thuận tiện định vị khu vực liên hệ và hình dung rõ hơn điểm kết nối của Aromis.
            </p>
          </div>

          <iframe
            title="Bản đồ khu vực HCMUTE"
            src="https://www.google.com/maps?q=Ho%20Chi%20Minh%20City%20University%20of%20Technology%20and%20Education&z=15&output=embed"
            className="h-[420px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </div>
  );
}