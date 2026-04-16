import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  return (
    <div className="p-8 bg-[#F9F9F9] min-h-screen">

      <h1 className="text-4xl font-bold text-center mb-8">
        Aromis – Website Bán Nước Hoa
      </h1>

      {/* GRID SẢN PHẨM */}
      <div className="grid grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

    </div>
  );
}