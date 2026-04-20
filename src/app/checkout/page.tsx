"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.totalPrice());
  const clearCart = useCartStore((state) => state.clearCart);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [selectedBank, setSelectedBank] = useState<any>(null);

  // 👉 danh sách ngân hàng
  const bankAccounts = [
    { bank: "MB Bank", number: "123456789", owner: "AROMIS" },
    { bank: "Vietcombank", number: "987654321", owner: "AROMIS" },
    { bank: "Techcombank", number: "555666888", owner: "AROMIS" },
  ];

  // 👉 mã đơn KHÔNG TRÙNG
  const generateOrderId = () => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    let id;

    do {
      id =
        "ARM-" +
        Date.now() +
        "-" +
        Math.floor(Math.random() * 1000);
    } while (orders.some((o: any) => o.orderId === id));

    return id;
  };

  // 👉 validate
  const validate = () => {
    const newErrors: any = {};

    if (!form.name.trim()) newErrors.name = "Nhập họ tên";
    if (!form.phone.trim()) newErrors.phone = "Nhập SĐT";
    else if (!/^[0-9]+$/.test(form.phone))
      newErrors.phone = "SĐT phải là số";

    if (!form.address.trim()) newErrors.address = "Nhập địa chỉ";
    if (!paymentMethod) newErrors.payment = "Chọn phương thức";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 👉 fake API
  const fakeSendToServer = async (order: any) => {
    console.log("🚀 Gửi đơn:", order);
    return new Promise((resolve) => setTimeout(resolve, 800));
  };

  // 👉 đặt hàng
  const handleOrder = async () => {
    if (!validate()) return;

    const orderId = generateOrderId();

    const newOrder = {
      orderId,
      purchaseDate: new Date().toISOString().split("T")[0],
      status:
        paymentMethod === "cod"
          ? "Chờ xác nhận"
          : "Chờ thanh toán",
      totalAmount: total,
      items: items,
    };

    // lưu localStorage
    const oldOrders =
      JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem(
      "orders",
      JSON.stringify([newOrder, ...oldOrders])
    );

    await fakeSendToServer(newOrder);

    setOrderInfo({
      type: paymentMethod,
      orderId,
      total,
    });

    clearCart();
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] px-6 md:px-16 py-12">

      {/* TITLE */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif">Thanh toán</h1>
        <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mt-2"></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">

        {/* FORM */}
        <div className="bg-white p-6 border">

          <input
            placeholder="Họ và tên"
            className="w-full border p-3 mb-2"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}

          <input
            placeholder="SĐT"
            className="w-full border p-3 mt-3 mb-2"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
          {errors.phone && <p className="text-red-500">{errors.phone}</p>}

          <input
            placeholder="Địa chỉ"
            className="w-full border p-3 mt-3 mb-2"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />
          {errors.address && <p className="text-red-500">{errors.address}</p>}

          {/* PAYMENT */}
          <div className="mt-4">
            <p className="font-semibold mb-2">Phương thức thanh toán</p>

            {/* COD */}
            <label className="block">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setSelectedBank(null);
                }}
              />{" "}
              COD (Thanh toán khi nhận hàng)
            </label>

            {/* BANK */}
            <label className="block mt-2">
              <input
                type="radio"
                name="payment"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);

                  const randomBank =
                    bankAccounts[
                      Math.floor(Math.random() * bankAccounts.length)
                    ];
                  setSelectedBank(randomBank);
                }}
              />{" "}
              Chuyển khoản
            </label>

            {errors.payment && (
              <p className="text-red-500">{errors.payment}</p>
            )}

            {/* BANK INFO */}
            {paymentMethod === "bank" && selectedBank && (
              <div className="mt-3 p-3 bg-gray-100 text-sm">
                <p><b>Ngân hàng:</b> {selectedBank.bank}</p>
                <p><b>STK:</b> {selectedBank.number}</p>
                <p><b>Chủ TK:</b> {selectedBank.owner}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleOrder}
            className="w-full mt-6 bg-black text-white py-3 hover:bg-[#D4AF37] hover:text-black"
          >
            ĐẶT HÀNG
          </button>
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-6 border">
          <h2 className="mb-4 font-semibold">Đơn hàng</h2>

          {items.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.name} x{item.quantity}</span>
              <span>
                {(item.price * item.quantity).toLocaleString()}đ
              </span>
            </div>
          ))}

          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Tổng</span>
            <span className="text-[#D4AF37]">
              {total.toLocaleString()}đ
            </span>
          </div>
        </div>
      </div>

      {/* POPUP */}
      {orderInfo && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 w-[90%] max-w-md text-center">

            {orderInfo.type === "bank" && selectedBank ? (
              <>
                <h2 className="font-bold mb-3">Thanh toán chuyển khoản</h2>

                <p><b>Ngân hàng:</b> {selectedBank.bank}</p>
                <p><b>STK:</b> {selectedBank.number}</p>
                <p><b>Chủ TK:</b> {selectedBank.owner}</p>

                <p className="mt-2">
                  Nội dung: <b>AROMIS {orderInfo.orderId}</b>
                </p>

                <p>
                  Số tiền: {orderInfo.total.toLocaleString()}đ
                </p>
              </>
            ) : (
              <>
                <h2 className="font-bold mb-3">Đặt hàng thành công</h2>
                <p>Mã đơn: {orderInfo.orderId}</p>
              </>
            )}

            <button
              onClick={() => setOrderInfo(null)}
              className="mt-4 px-6 py-2 bg-[#D4AF37]"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}