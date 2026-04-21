"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCartStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fcfaf6] via-[#f7f4ee] to-[#f1ede6] px-4 md:px-10 lg:px-16 py-12">
      {/* HEADER */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow border border-[#eee2c6] text-[#b68a2e] text-sm">
          <ShoppingBag size={16} />
          Aromis Luxury Cart
        </div>

        <h1 className="text-4xl md:text-5xl font-serif text-[#111] mt-5">
          Giỏ hàng của bạn
        </h1>

        <p className="text-gray-500 mt-3">
          Sản phẩm chính hãng • Giao hàng toàn quốc • Thanh toán an toàn
        </p>

        <div className="w-28 h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-5 rounded-full" />
      </div>

      {items.length === 0 ? (
        <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
          <div className="w-20 h-20 rounded-full bg-[#f8f2df] flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="text-[#D4AF37]" size={34} />
          </div>

          <h2 className="text-2xl font-serif mb-2">Giỏ hàng đang trống</h2>

          <p className="text-gray-500 mb-8">
            Hãy chọn những mùi hương yêu thích của bạn.
          </p>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white hover:scale-105 transition"
          >
            Mua sắm ngay <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl p-5 shadow-lg hover:shadow-2xl transition border border-white/70 flex gap-5"
              >
                {/* PRODUCT IMAGE */}
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-[#f5f5f5] shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                {/* INFO */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-serif text-[#111]">
                      {item.name}
                    </h2>

                    <p className="text-[#D4AF37] font-semibold text-lg mt-2">
                      {item.price.toLocaleString()} đ
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Nước hoa cao cấp chính hãng
                    </p>
                  </div>

                  {/* ACTION */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5">
                    {/* QUANTITY */}
                    <div className="flex items-center rounded-2xl overflow-hidden border border-gray-200 bg-[#fafafa] w-fit">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-4 py-2 hover:bg-gray-200 transition"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="px-5 font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-4 py-2 hover:bg-gray-200 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={16} />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="sticky top-24 h-fit">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-white/70">
              <h2 className="text-2xl font-serif mb-6">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tạm tính</span>
                  <span className="font-medium">
                    {totalPrice().toLocaleString()} đ
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Vận chuyển</span>
                  <span className="text-green-600 font-medium">
                    Miễn phí
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Thuế</span>
                  <span>0 đ</span>
                </div>

                <div className="border-t pt-5 flex justify-between text-lg font-semibold">
                  <span>Tổng cộng</span>
                  <span className="text-[#D4AF37]">
                    {totalPrice().toLocaleString()} đ
                  </span>
                </div>
              </div>

              {/* BENEFITS */}
              <div className="mt-6 space-y-3 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-[#D4AF37]" />
                  Giao hàng nhanh toàn quốc
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#D4AF37]" />
                  Bảo đảm hàng chính hãng
                </div>
              </div>

              {/* BUTTONS */}
              <Link
                href="/checkout"
                className="mt-8 w-full inline-flex justify-center items-center gap-2 py-4 rounded-2xl bg-[#D4AF37] text-black font-semibold tracking-wider hover:bg-black hover:text-white transition"
              >
                THANH TOÁN <ArrowRight size={18} />
              </Link>

              <button
                onClick={clearCart}
                className="w-full mt-3 py-3 rounded-2xl border border-gray-200 text-sm hover:bg-gray-50 transition"
              >
                Xóa toàn bộ giỏ hàng
              </button>

              <Link
                href="/products"
                className="block text-center mt-4 text-sm text-gray-400 hover:text-black transition"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}