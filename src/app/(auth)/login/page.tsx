import type { Metadata } from "next";
import AuthForm from "@/components/ui/AuthForm";

export const metadata: Metadata = {
  title: "Đăng nhập | Aromis",
  description: "Đăng nhập tài khoản Aromis để xem lịch sử đơn hàng và tiếp tục trải nghiệm mua sắm.",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}