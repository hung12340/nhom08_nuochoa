import type { Metadata } from "next";
import AuthForm from "@/components/ui/AuthForm";

export const metadata: Metadata = {
  title: "Đăng ký | Aromis",
  description: "Tạo tài khoản Aromis để lưu dữ liệu demo và sử dụng lịch sử đơn hàng trên website.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}