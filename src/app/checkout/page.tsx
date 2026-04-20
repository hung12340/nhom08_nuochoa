"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  CreditCard,
  Truck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);

  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const banks = [
    { bank: "Vietcombank", number: "987654321", owner: "AROMIS" },
    { bank: "MB Bank", number: "123456789", owner: "AROMIS" },
    { bank: "Techcombank", number: "555666888", owner: "AROMIS" },
  ];

  const selectedBank = useMemo(() => banks[0], []);
  const transferCode = useMemo(
    () => "ARM" + Math.floor(100000 + Math.random() * 900000),
    []
  );

  const shipping = total >= 1000000 ? 0 : 30000;
  const finalTotal = total + shipping;

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.name.trim()) e.name = "Vui lòng nhập họ tên";
    if (!/^0\d{9,10}$/.test(form.phone))
      e.phone = "Số điện thoại không hợp lệ";
    if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Email không hợp lệ";
    if (!form.address.trim())
      e.address = "Vui lòng nhập địa chỉ";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleOrder = async () => {
    if (items.length === 0) return;
    if (!validate()) return;

    setLoading(true);

    await new Promise((r) => setTimeout(r, 1200));

    const order = {
      id: "ARM-" + Date.now(),
      customer: form,
      total: finalTotal,
      status:
        paymentMethod === "cod"
          ? "Chờ xác nhận"
          : "Chờ thanh toán",
      createdAt: new Date().toLocaleString("vi-VN"),
    };

    localStorage.setItem("last-order", JSON.stringify(order));
    setOrderInfo(order);
    clearCart();
    setLoading(false);
  };

  if (!mounted) return null;

  if (items.length === 0 && !orderInfo) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center px-4">
        <div className="bg-white p-10 rounded-3xl shadow-sm text-center max-w-md">
          <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-4">
            Giỏ hàng đang trống
          </h1>
          <p className="text-gray-500 mb-6">
            Vui lòng thêm sản phẩm trước khi thanh toán
          </p>
          <Link
            href="/products"
            className="px-6 py-3 rounded-xl bg-[#D4AF37] text-black font-semibold"
          >
            Mua sắm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] px-4 md:px-10 py-10 text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="uppercase tracking-[0.4em] text-[#D4AF37] text-xs">
            Aromis Checkout
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold mt-3">
            Thanh Toán
          </h1>
          <p className="text-gray-500 mt-3">
            Nhanh chóng - An toàn - Chính hãng
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-5">
              <Sparkles className="text-[#D4AF37]" />
              Thông tin đặt hàng
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Họ và tên"
                value={form.name}
                error={errors.name}
                onChange={(v: string) =>
                  setForm({ ...form, name: v })
                }
              />
              <Input
                label="Số điện thoại"
                value={form.phone}
                error={errors.phone}
                onChange={(v: string) =>
                  setForm({ ...form, phone: v })
                }
              />
            </div>

            <div className="mt-4">
              <Input
                label="Email"
                value={form.email}
                error={errors.email}
                onChange={(v: string) =>
                  setForm({ ...form, email: v })
                }
              />
            </div>

            <div className="mt-4">
              <Input
                label="Địa chỉ nhận hàng"
                value={form.address}
                error={errors.address}
                onChange={(v: string) =>
                  setForm({ ...form, address: v })
                }
              />
            </div>

            <div className="mt-4">
              <Input
                label="Ghi chú"
                value={form.note}
                onChange={(v: string) =>
                  setForm({ ...form, note: v })
                }
              />
            </div>

            <h3 className="mt-8 mb-3 font-medium">
              Phương thức thanh toán
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <PayCard
                active={paymentMethod === "cod"}
                icon={<Truck />}
                title="COD"
                desc="Thanh toán khi nhận hàng"
                onClick={() => setPaymentMethod("cod")}
              />

              <PayCard
                active={paymentMethod === "bank"}
                icon={<CreditCard />}
                title="Chuyển khoản"
                desc="Chuyển khoản ngân hàng"
                onClick={() => setPaymentMethod("bank")}
              />
            </div>

            {paymentMethod === "bank" && (
              <div className="mt-4 rounded-2xl bg-[#fff8df] border border-[#f0e2a3] p-4 text-sm space-y-1">
                <p>
                  <b>{selectedBank.bank}</b>
                </p>
                <p>Số tài khoản: {selectedBank.number}</p>
                <p>Chủ tài khoản: {selectedBank.owner}</p>
                <p>Nội dung CK: {transferCode}</p>
              </div>
            )}

            <button
              onClick={handleOrder}
              disabled={loading}
              className="w-full mt-8 rounded-2xl py-4 font-semibold bg-[#D4AF37] hover:opacity-90 transition"
            >
              {loading
                ? "ĐANG XỬ LÝ..."
                : "HOÀN TẤT ĐẶT HÀNG"}
            </button>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 h-fit sticky top-6"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShoppingBag className="text-[#D4AF37]" />
              Đơn hàng
            </h2>

            <div className="mt-5 space-y-3">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b border-gray-100 pb-3 text-sm"
                >
                  <div>
                    <p>{item.name}</p>
                    <p className="text-gray-400">
                      x{item.quantity}
                    </p>
                  </div>

                  <span>
                    {(item.price * item.quantity).toLocaleString()}đ
                  </span>
                </div>
              ))}
            </div>

            <PriceRow label="Tạm tính" value={total} />
            <PriceRow label="Vận chuyển" value={shipping} />

            <div className="flex justify-between mt-4 pt-4 border-t font-semibold text-lg">
              <span>Tổng cộng</span>
              <span className="text-[#D4AF37]">
                {finalTotal.toLocaleString()}đ
              </span>
            </div>

            <div className="mt-4 text-xs text-gray-500 flex gap-2">
              <ShieldCheck size={16} />
              Bảo mật thanh toán SSL
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {orderInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl"
            >
              <h3 className="text-2xl font-semibold text-[#D4AF37]">
                Đặt hàng thành công
              </h3>

              <div className="space-y-2 mt-4 text-sm text-gray-600">
                <p>
                  Mã đơn: <b>{orderInfo.id}</b>
                </p>
                <p>Khách hàng: {orderInfo.customer.name}</p>
                <p>Trạng thái: {orderInfo.status}</p>
                <p>Ngày đặt: {orderInfo.createdAt}</p>
                <p>
                  Tổng tiền:{" "}
                  {orderInfo.total.toLocaleString()}đ
                </p>
              </div>

              <button
                onClick={() => setOrderInfo(null)}
                className="w-full mt-5 rounded-2xl py-3 bg-[#D4AF37] font-semibold"
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Input({ label, value, onChange, error }: any) {
  return (
    <div>
      <p className="text-sm mb-2 text-gray-600">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#D4AF37]"
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}

function PriceRow({ label, value }: any) {
  return (
    <div className="flex justify-between mt-3 text-sm">
      <span className="text-gray-500">{label}</span>
      <span>{value.toLocaleString()}đ</span>
    </div>
  );
}

function PayCard({
  active,
  icon,
  title,
  desc,
  onClick,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-2xl p-4 border transition ${
        active
          ? "border-[#D4AF37] bg-[#fff8df]"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex gap-3 items-center">
        {icon}
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>
    </button>
  );
}