"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useSyncExternalStore, useTransition } from "react";
import {
  STORAGE_EVENT_NAME,
  authenticateStoredUser,
  ensureOrderHistory,
  getRememberedEmail,
  getStoredUsers,
  isValidEmail,
  registerStoredUser,
  setCurrentUserEmail,
  setRememberedEmail,
  signInWithSocialProvider,
  type SocialProvider,
} from "@/lib/clientStorage";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

type AuthFormState = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type AuthFormErrors = Partial<Record<"email" | "password" | "general", string>>;

const socialProviderLabels: Record<SocialProvider, string> = {
  google: "Google",
  github: "GitHub",
};

function subscribeToBrowserStore(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_EVENT_NAME, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_EVENT_NAME, onStoreChange);
  };
}

const authContent = {
  login: {
    eyebrow: "Aromis account",
    title: "Đăng nhập để tiếp tục hành trình hương thơm",
    submitLabel: "Đăng nhập",
    alternateLabel: "Chưa có tài khoản?",
    alternateLinkLabel: "Đăng ký ngay",
    alternateHref: "/register",
  },
  register: {
    eyebrow: "Create profile",
    title: "Tạo tài khoản Aromis trong vài bước ngắn",
    submitLabel: "Tạo tài khoản",
    alternateLabel: "Đã có tài khoản?",
    alternateLinkLabel: "Đăng nhập",
    alternateHref: "/login",
  },
} as const;

function validateForm(mode: AuthMode, values: AuthFormState) {
  const errors: AuthFormErrors = {};

  if (!values.email.trim()) {
    errors.email = "Vui lòng nhập email.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Email chưa đúng định dạng.";
  }

  if (!values.password.trim()) {
    errors.password = "Vui lòng nhập mật khẩu.";
  } else if (mode === "register" && values.password.trim().length < 6) {
    errors.password = "Mật khẩu cần có ít nhất 6 ký tự.";
  }

  return errors;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const rememberedEmail = useSyncExternalStore(subscribeToBrowserStore, getRememberedEmail, () => "");
  const [emailInput, setEmailInput] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [rememberChoice, setRememberChoice] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [statusMessage, setStatusMessage] = useState("");

  const formValues: AuthFormState = {
    email: emailInput ?? rememberedEmail,
    password,
    rememberMe: rememberChoice ?? Boolean(rememberedEmail),
  };

  const content = authContent[mode];

  const handleFieldChange = (field: keyof AuthFormState, value: string | boolean) => {
    if (field === "email") {
      setEmailInput(value as string);
    }

    if (field === "password") {
      setPassword(value as string);
    }

    if (field === "rememberMe") {
      setRememberChoice(value as boolean);
    }

    setErrors((current) => ({
      ...current,
      [field === "rememberMe" ? "general" : field]: undefined,
      general: undefined,
    }));
    setStatusMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm(mode, formValues);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (mode === "register") {
      const result = registerStoredUser(formValues.email, formValues.password);

      if (!result.success) {
        setErrors({ general: result.message });
        return;
      }

      if (formValues.rememberMe) {
        setRememberedEmail(formValues.email);
      } else {
        setRememberedEmail(null);
      }

      setCurrentUserEmail(formValues.email);
      ensureOrderHistory(formValues.email);
      setStatusMessage("Tạo tài khoản thành công. Aromis đang chuyển bạn tới lịch sử đơn hàng.");

      startTransition(() => {
        router.push("/orders");
      });

      return;
    }

    const authenticatedUser = authenticateStoredUser(formValues.email, formValues.password);

    if (!authenticatedUser) {
      const hasRegisteredUsers = getStoredUsers().length > 0;

      setErrors({
        general: hasRegisteredUsers
          ? "Email hoặc mật khẩu chưa chính xác."
          : "Chưa có tài khoản nào trên trình duyệt này. Hãy đăng ký trước.",
      });
      return;
    }

    if (formValues.rememberMe) {
      setRememberedEmail(formValues.email);
    } else {
      setRememberedEmail(null);
    }

    setCurrentUserEmail(authenticatedUser.email);
    ensureOrderHistory(authenticatedUser.email);
    setStatusMessage("Đăng nhập thành công. Aromis đang mở lịch sử đơn hàng cho bạn.");

    startTransition(() => {
      router.push("/orders");
    });
  };

  const handleSocialSignIn = (provider: SocialProvider) => {
    setErrors({});
    const socialEmail = signInWithSocialProvider(provider);

    ensureOrderHistory(socialEmail);
    setStatusMessage(`Đăng nhập thành công qua ${socialProviderLabels[provider]}. Aromis đang chuyển bạn tới lịch sử đơn hàng.`);

    startTransition(() => {
      router.push("/orders");
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#1A1A1A]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[#1A1A1A] lg:flex">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage:
                "url('https://orchard.vn/wp-content/uploads/2023/08/maison-francis-kurkdjian-baccarat-rouge-540-extrait-de-parfum_7.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(26,26,26,0.9),rgba(26,26,26,0.56),rgba(212,175,55,0.22))]" />

          <div className="relative z-10 flex w-full items-center px-12 py-16 text-white xl:px-16">
            <div>
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.45em] text-[#D4AF37]">
                Aromis
              </p>
              <h2 className="max-w-xl font-serif text-5xl leading-tight xl:text-6xl">
                Đẳng cấp đến từ sự chân thực trong từng lớp hương.
              </h2>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-12 sm:px-8 lg:px-12 xl:px-16">
          <div className="w-full max-w-xl border border-[#1A1A1A]/8 bg-white p-8 shadow-[0_24px_80px_rgba(26,26,26,0.08)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#D4AF37]">{content.eyebrow}</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-[#1A1A1A] sm:text-5xl">{content.title}</h1>

            <div className="mt-8 grid grid-cols-2 gap-2 rounded-full bg-[#F4F1E8] p-1 text-sm font-semibold">
              <Link
                href="/login"
                className={`rounded-full px-4 py-3 text-center transition ${
                  mode === "login" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/70 hover:text-[#1A1A1A]"
                }`}
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className={`rounded-full px-4 py-3 text-center transition ${
                  mode === "register" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/70 hover:text-[#1A1A1A]"
                }`}
              >
                Đăng ký
              </Link>
            </div>

            {mode === "login" ? (
              <>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleSocialSignIn("google")}
                    className="flex items-center justify-center gap-3 border border-[#1A1A1A]/12 bg-white px-4 py-3.5 text-sm font-semibold text-[#1A1A1A] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  >
                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill="#4285F4"
                        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.26-2.08 3.57-5.15 3.57-8.85Z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.87-3c-1.07.72-2.44 1.15-4.08 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09A12 12 0 0 0 12 24Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.55.38-2.28V6.63H1.27A12 12 0 0 0 0 12c0 1.94.46 3.78 1.27 5.37l4-3.09Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.77c1.76 0 3.35.61 4.59 1.8l3.44-3.44C17.95 1.18 15.23 0 12 0A12 12 0 0 0 1.27 6.63l4 3.09c.95-2.85 3.6-4.95 6.73-4.95Z"
                      />
                    </svg>
                    <span>Tiếp tục với Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialSignIn("github")}
                    className="flex items-center justify-center gap-3 border border-[#1A1A1A]/12 bg-white px-4 py-3.5 text-sm font-semibold text-[#1A1A1A] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 .5C5.65.5.5 5.65.5 12A11.5 11.5 0 0 0 8.36 22.93c.58.1.79-.25.79-.56v-2.16c-3.2.7-3.88-1.35-3.88-1.35-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.04 1.77 2.72 1.26 3.38.97.1-.75.4-1.26.72-1.55-2.56-.29-5.25-1.28-5.25-5.72 0-1.27.46-2.3 1.2-3.11-.12-.3-.52-1.47.11-3.06 0 0 .98-.31 3.2 1.19A11.1 11.1 0 0 1 12 6.15c.98 0 1.97.13 2.89.38 2.22-1.5 3.2-1.19 3.2-1.19.63 1.59.23 2.76.11 3.06.75.81 1.2 1.84 1.2 3.11 0 4.45-2.7 5.43-5.28 5.71.42.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                    </svg>
                    <span>Tiếp tục với GitHub</span>
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#1A1A1A]/35">
                  <span className="h-px flex-1 bg-[#1A1A1A]/10" />
                  <span>Hoặc đăng nhập bằng email</span>
                  <span className="h-px flex-1 bg-[#1A1A1A]/10" />
                </div>
              </>
            ) : null}

            <form onSubmit={handleSubmit} className={`${mode === "login" ? "mt-6" : "mt-8"} space-y-5`} noValidate>
              <div>
                <label htmlFor={`${mode}-email`} className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                  Email
                </label>
                <input
                  id={`${mode}-email`}
                  type="email"
                  value={formValues.email}
                  onChange={(event) => handleFieldChange("email", event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  className={`w-full border px-4 py-3 text-sm outline-none transition sm:text-base ${
                    errors.email
                      ? "border-red-500 bg-red-50/60 text-red-700"
                      : "border-[#1A1A1A]/12 bg-[#FCFBF8] focus:border-[#D4AF37]"
                  }`}
                />
                {errors.email ? <p className="mt-2 text-sm text-red-600">{errors.email}</p> : null}
              </div>

              <div>
                <label htmlFor={`${mode}-password`} className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                  Mật khẩu
                </label>
                <input
                  id={`${mode}-password`}
                  type="password"
                  value={formValues.password}
                  onChange={(event) => handleFieldChange("password", event.target.value)}
                  placeholder="Nhập mật khẩu"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  aria-invalid={Boolean(errors.password)}
                  className={`w-full border px-4 py-3 text-sm outline-none transition sm:text-base ${
                    errors.password
                      ? "border-red-500 bg-red-50/60 text-red-700"
                      : "border-[#1A1A1A]/12 bg-[#FCFBF8] focus:border-[#D4AF37]"
                  }`}
                />
                {errors.password ? <p className="mt-2 text-sm text-red-600">{errors.password}</p> : null}
              </div>

              <label className="flex items-center gap-3 text-sm text-[#1A1A1A]/72">
                <input
                  type="checkbox"
                  checked={formValues.rememberMe}
                  onChange={(event) => handleFieldChange("rememberMe", event.target.checked)}
                  className="h-4 w-4 accent-[#D4AF37]"
                />
                <span>Remember me</span>
              </label>

              {errors.general ? (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.general}</div>
              ) : null}

              {statusMessage ? (
                <div className="border border-[#D4AF37]/45 bg-[#D4AF37]/10 px-4 py-3 text-sm text-[#7F5B00]">
                  {statusMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#1A1A1A] px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#D4AF37] hover:text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Đang xử lý" : content.submitLabel}
              </button>
            </form>

            <div className="mt-6 border-t border-[#1A1A1A]/8 pt-5">
              <p className="text-sm text-[#1A1A1A]/70">
                {content.alternateLabel}{" "}
                <Link href={content.alternateHref} className="font-semibold text-[#D4AF37] hover:text-[#1A1A1A]">
                  {content.alternateLinkLabel}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}