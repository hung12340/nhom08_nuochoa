import type { Metadata } from "next";
import AuthForm from "@/components/ui/AuthForm";

export const metadata: Metadata = {
  title: "Đăng nhập | Aromis",
  description: "Đăng nhập bằng tài khoản có sẵn hoặc bằng Google, GitHub thật để xem lịch sử đơn hàng tại Aromis.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}