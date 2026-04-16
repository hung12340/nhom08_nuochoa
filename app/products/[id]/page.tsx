import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default async function ProductDetail({ params }: any) {
  // 🔥 FIX QUAN TRỌNG (Next 16)
  const { id } = await params;

  const product = products.find((p) => p.id === id);

  if (!product) {
    return <div className="p-10">Không tìm thấy sản phẩm</div>;
  }

  const related = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="p-10 bg-[#F9F9F9] min-h-screen">

      <div className="grid grid-cols-2 gap-10">

        {/* IMAGE */}
        <div>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full rounded-xl"
          />
        </div>

        {/* INFO */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-gray-500 mt-2">{product.brand}</p>

          <p className="text-[#D4AF37] text-2xl font-bold mt-4">
            {product.price.toLocaleString()}đ
          </p>

          <p className="mt-4">{product.description}</p>

          <button className="mt-6 bg-[#D4AF37] text-white px-6 py-3 rounded-xl">
            Thêm vào giỏ
          </button>
        </div>

      </div>

      {/* 🔹 SẢN PHẨM GỢI Ý */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Sản phẩm gợi ý</h2>

        <div className="grid grid-cols-4 gap-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

    </div>
  );
}