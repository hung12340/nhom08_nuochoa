"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  getAuthErrorMessage,
  loginWithCredentials,
  registerAccount,
  signInWithGitHub,
  signInWithGoogle,
} from "@/lib/auth";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

type AuthFormState = {
  username: string;
  password: string;
  confirmPassword: string;
};

type AuthFormErrors = Partial<Record<"username" | "password" | "confirmPassword" | "general", string>>;

const authContent = {
  login: {
    title: "Đăng nhập",
    submitLabel: "Đăng nhập",
    alternateLabel: "Chưa có tài khoản?",
    alternateLinkLabel: "Đăng ký",
    alternateHref: "/register",
  },
  register: {
    title: "Đăng ký",
    submitLabel: "Tạo tài khoản",
    alternateLabel: "Đã có tài khoản?",
    alternateLinkLabel: "Đăng nhập",
    alternateHref: "/login",
  },
} as const;

const providerLabels = {
  google: "Google",
  github: "GitHub",
} as const;

function validateForm(mode: AuthMode, values: AuthFormState) {
  const errors: AuthFormErrors = {};

  if (!values.username.trim()) {
    errors.username = "Vui lòng nhập tên tài khoản.";
  } else if (mode === "register" && values.username.trim().length < 3) {
    errors.username = "Tên tài khoản cần có ít nhất 3 ký tự.";
  }

  if (!values.password.trim()) {
    errors.password = "Vui lòng nhập mật khẩu.";
  } else if (values.password.trim().length < 6) {
    errors.password = "Mật khẩu cần có ít nhất 6 ký tự.";
  }

  if (mode === "register") {
    if (!values.confirmPassword.trim()) {
      errors.confirmPassword = "Vui lòng nhập lại mật khẩu.";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Mật khẩu nhập lại chưa khớp.";
    }
  }

  return errors;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [formValues, setFormValues] = useState<AuthFormState>({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [pendingAction, setPendingAction] = useState<"credentials" | "google" | "github" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const content = authContent[mode];

  const handleFieldChange = (field: keyof AuthFormState, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      general: undefined,
    }));
    setStatusMessage("");
  };

  const handleCredentialSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm(mode, formValues);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setPendingAction("credentials");

    try {
      if (mode === "register") {
        const result = registerAccount(formValues.username, formValues.password);

        if (!result.success) {
          setErrors({ general: result.message });
          return;
        }

        setFormValues({
          username: "",
          password: "",
          confirmPassword: "",
        });
        setStatusMessage("Đăng ký thành công.");
        return;
      }

      const result = await loginWithCredentials(formValues.username, formValues.password);

      if (!result.success) {
        setErrors({ general: result.message });
        return;
      }

      router.push("/orders");
    } finally {
      setPendingAction(null);
    }
  };

  const handleSocialSignIn = async (provider: keyof typeof providerLabels) => {
    setErrors({});
    setStatusMessage("");
    setPendingAction(provider);

    try {
      if (provider === "google") {
        await signInWithGoogle();
      } else {
        await signInWithGitHub();
      }

      router.push("/orders");
    } catch (error) {
      setErrors({
        general: getAuthErrorMessage(error, providerLabels[provider]),
      });
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.16),transparent_30%),linear-gradient(180deg,#f9f9f9_0%,#f3efe5_100%)] px-5 py-10 text-[#1A1A1A] sm:px-8 lg:px-12">
      <div className="w-full max-w-lg rounded-4xl border border-[#1A1A1A]/8 bg-white/95 p-6 shadow-[0_28px_90px_rgba(26,26,26,0.08)] backdrop-blur-sm sm:p-8">
        <div className="grid grid-cols-2 gap-2 rounded-full bg-[#F4F1E8] p-1 text-sm font-semibold">
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

        <h1 className="mt-8 text-center font-serif text-4xl text-[#1A1A1A] sm:text-5xl">{content.title}</h1>

        {mode === "login" ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleSocialSignIn("google")}
              disabled={pendingAction !== null}
              className="flex items-center justify-center gap-3 rounded-2xl border border-[#1A1A1A]/12 bg-white px-4 py-4 text-sm font-semibold text-[#1A1A1A] shadow-[0_12px_30px_rgba(26,26,26,0.04)] transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-60"
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
              <span>{pendingAction === "google" ? "Đang mở Google" : "Đăng nhập với Google"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialSignIn("github")}
              disabled={pendingAction !== null}
              className="flex items-center justify-center gap-3 rounded-2xl border border-[#1A1A1A]/12 bg-white px-4 py-4 text-sm font-semibold text-[#1A1A1A] shadow-[0_12px_30px_rgba(26,26,26,0.04)] transition hover:-translate-y-0.5 hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12A11.5 11.5 0 0 0 8.36 22.93c.58.1.79-.25.79-.56v-2.16c-3.2.7-3.88-1.35-3.88-1.35-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.04 1.77 2.72 1.26 3.38.97.1-.75.4-1.26.72-1.55-2.56-.29-5.25-1.28-5.25-5.72 0-1.27.46-2.3 1.2-3.11-.12-.3-.52-1.47.11-3.06 0 0 .98-.31 3.2 1.19A11.1 11.1 0 0 1 12 6.15c.98 0 1.97.13 2.89.38 2.22-1.5 3.2-1.19 3.2-1.19.63 1.59.23 2.76.11 3.06.75.81 1.2 1.84 1.2 3.11 0 4.45-2.7 5.43-5.28 5.71.42.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
              </svg>
              <span>{pendingAction === "github" ? "Đang mở GitHub" : "Đăng nhập với GitHub"}</span>
            </button>
          </div>
        ) : null}

        {mode === "login" ? (
          <div className="mt-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#1A1A1A]/30">
            <span className="h-px flex-1 bg-[#1A1A1A]/10" />
            <span>Hoặc</span>
            <span className="h-px flex-1 bg-[#1A1A1A]/10" />
          </div>
        ) : null}

        <form onSubmit={handleCredentialSubmit} className={`${mode === "login" ? "mt-6" : "mt-8"} space-y-5`} noValidate>
          <div>
            <label htmlFor={`${mode}-username`} className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
              Tên tài khoản
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/34">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                id={`${mode}-username`}
                type="text"
                value={formValues.username}
                onChange={(event) => handleFieldChange("username", event.target.value)}
                placeholder="Nhập tên tài khoản"
                autoComplete="username"
                autoFocus={mode === "login"}
                aria-invalid={Boolean(errors.username)}
                className={`w-full rounded-2xl border py-3.5 pl-12 pr-4 text-sm outline-none transition sm:text-base ${
                  errors.username
                    ? "border-red-500 bg-red-50/60 text-red-700"
                    : "border-[#1A1A1A]/12 bg-[#FCFBF8] focus:border-[#D4AF37]"
                }`}
              />
            </div>
            {errors.username ? <p className="mt-2 text-sm text-red-600">{errors.username}</p> : null}
          </div>

          <div>
            <label htmlFor={`${mode}-password`} className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
              Mật khẩu
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/34">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-4-6V9a4 4 0 118 0v2m-9 0h10a1 1 0 011 1v7a1 1 0 01-1 1H7a1 1 0 01-1-1v-7a1 1 0 011-1z" />
                </svg>
              </span>
              <input
                id={`${mode}-password`}
                type={showPassword ? "text" : "password"}
                value={formValues.password}
                onChange={(event) => handleFieldChange("password", event.target.value)}
                placeholder="Nhập mật khẩu"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                aria-invalid={Boolean(errors.password)}
                className={`w-full rounded-2xl border py-3.5 pl-12 pr-14 text-sm outline-none transition sm:text-base ${
                  errors.password
                    ? "border-red-500 bg-red-50/60 text-red-700"
                    : "border-[#1A1A1A]/12 bg-[#FCFBF8] focus:border-[#D4AF37]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#1A1A1A]/54 transition hover:text-[#D4AF37]"
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
            {errors.password ? <p className="mt-2 text-sm text-red-600">{errors.password}</p> : null}
          </div>

          {mode === "register" ? (
            <div>
              <label htmlFor="register-confirm-password" className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                Nhập lại mật khẩu
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/34">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-4-6V9a4 4 0 118 0v2m-9 0h10a1 1 0 011 1v7a1 1 0 01-1 1H7a1 1 0 01-1-1v-7a1 1 0 011-1z" />
                  </svg>
                </span>
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formValues.confirmPassword}
                  onChange={(event) => handleFieldChange("confirmPassword", event.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  className={`w-full rounded-2xl border py-3.5 pl-12 pr-14 text-sm outline-none transition sm:text-base ${
                    errors.confirmPassword
                      ? "border-red-500 bg-red-50/60 text-red-700"
                      : "border-[#1A1A1A]/12 bg-[#FCFBF8] focus:border-[#D4AF37]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#1A1A1A]/54 transition hover:text-[#D4AF37]"
                >
                  {showConfirmPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
              {errors.confirmPassword ? <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p> : null}
            </div>
          ) : null}

          {errors.general ? (
            <div aria-live="polite" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors.general}
            </div>
          ) : null}

          {statusMessage ? (
            <div aria-live="polite" className="rounded-2xl border border-[#D4AF37]/45 bg-[#D4AF37]/10 px-4 py-3 text-sm text-[#7F5B00]">
              {statusMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={pendingAction !== null}
            className="w-full rounded-full bg-[#1A1A1A] px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#D4AF37] hover:text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pendingAction === "credentials" ? "Đang xử lý" : content.submitLabel}
          </button>
        </form>

        <div className="mt-6 border-t border-[#1A1A1A]/8 pt-5">
          <p className="text-center text-sm text-[#1A1A1A]/70">
            {content.alternateLabel}{" "}
            <Link href={content.alternateHref} className="font-semibold text-[#D4AF37] hover:text-[#1A1A1A]">
              {content.alternateLinkLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}