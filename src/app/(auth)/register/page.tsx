import type { Metadata } from "next";
import AuthForm from "@/components/ui/AuthForm";

export const metadata: Metadata = {
  title: "Đăng ký | Aromis",
  description: "Tạo tài khoản Aromis với tên đăng nhập và mật khẩu để dùng ngay trong form đăng nhập.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}