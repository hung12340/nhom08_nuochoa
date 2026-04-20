"use client";

import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  return (
    <div className="min-h-screen bg-[#F9F9F9] px-6 md:px-16 py-12">
      
      {/* TITLE */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-serif text-[#1A1A1A] mb-2">
          Giỏ hàng của bạn
        </h1>
        <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto"></div>
      </div>

      {items.length === 0 ? (
        <div className="text-center mt-20 text-gray-500">
          <p className="text-lg italic">Giỏ hàng của bạn đang trống...</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex bg-white border border-gray-100 shadow-sm hover:shadow-md transition p-5"
              >

                {/* IMAGE */}
                <div className="w-28 h-28 bg-gray-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-full h-full hover:scale-105 transition duration-500"
                  />
                </div>

                {/* INFO */}
                <div className="ml-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-serif text-lg text-[#1A1A1A]">
                      {item.name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.price.toLocaleString()} đ
                    </p>
                  </div>

                  {/* ACTION */}
                  <div className="flex items-center justify-between mt-4">

                    {/* QUANTITY */}
                    <div className="flex items-center border border-gray-200">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        −
                      </button>

                      <span className="px-4">{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-gray-400 hover:text-red-500 transition"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="bg-white border border-gray-100 p-8 shadow-sm h-fit sticky top-24">

            <h2 className="text-xl font-serif text-[#1A1A1A] mb-6">
              Tóm tắt đơn hàng
            </h2>

            {/* LINE */}
            <div className="flex justify-between text-sm mb-3">
              <span>Tạm tính</span>
              <span>{totalPrice().toLocaleString()} đ</span>
            </div>

            <div className="flex justify-between text-sm mb-6">
              <span>Phí vận chuyển</span>
              <span>Miễn phí</span>
            </div>

            <div className="border-t pt-4 flex justify-between font-semibold text-lg">
              <span>Tổng cộng</span>
              <span className="text-[#D4AF37]">
                {totalPrice().toLocaleString()} đ
              </span>
            </div>

            {/* BUTTON */}
            <button className="w-full mt-8 bg-[#D4AF37] text-[#1A1A1A] py-3 tracking-widest text-sm font-semibold hover:bg-[#1A1A1A] hover:text-white transition duration-300">
              THANH TOÁN
            </button>

            {/* CONTINUE */}
            <p className="text-center text-sm text-gray-400 mt-4">
              Tiếp tục mua sắm
            </p>
          </div>

        </div>
      )}
    </div>
  );
}