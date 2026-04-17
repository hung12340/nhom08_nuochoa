import { notFound } from 'next/navigation';
import { getProductById, getRelatedProducts, getAllProducts } from '@/lib/products';
import ProductGallery from '@/components/ProductGallery';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';
import type { Metadata } from 'next';

// Tạo static params cho tất cả sản phẩm (bắt buộc với output: "export")
export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

// Metadata động (cũng phải await params)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: 'Sản phẩm không tồn tại' };
  return {
    title: `${product.name} - ${product.brand} | Aromis`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params trước khi sử dụng (Next.js 15+)
  const { id } = await params;
  const product = getProductById(id);

  // Nếu không tìm thấy sản phẩm, trả về 404
  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product.id, product.gender, 4);

  return (
    <main className="min-h-screen" style={{ background: '#F9F9F9' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Gallery ảnh */}
          <div className="lg:w-7/12 xl:w-3/5">
            <div
              className="rounded-3xl overflow-hidden shadow-xl"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <ProductGallery images={product.images} name={product.name} />
            </div>
          </div>

          {/* Thông tin sản phẩm + Mô tả + Nút thêm vào giỏ */}
          <div className="lg:w-5/12 xl:w-2/5 flex flex-col justify-center">
            <div
              className="bg-white rounded-3xl p-6 md:p-8 lg:p-10 shadow-sm"
              style={{ border: '1px solid rgba(212,175,55,0.15)' }}
            >
              {/* Thương hiệu */}
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
                {product.brand}
              </p>

              {/* Tên sản phẩm */}
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A] mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Giá */}
              <div className="text-3xl font-semibold text-[#D4AF37] mb-6">
                {product.price.toLocaleString('vi-VN')} ₫
              </div>

              {/* Thông tin chi tiết */}
              <div className="space-y-3 text-[#1A1A1A] mb-6">
                <div className="flex items-center">
                  <span className="font-medium w-28">Dung tích:</span>
                  <span>{product.volume}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-28">Giới tính:</span>
                  <span className="capitalize">{product.gender}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-28">Tình trạng:</span>
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-medium">
                      Còn hàng ({product.stock} sản phẩm)
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium">Hết hàng</span>
                  )}
                </div>
              </div>

              {/* Mô tả sản phẩm */}
              <div className="border-t border-gray-100 pt-6 mb-8">
                <h2 className="font-serif text-xl mb-3 text-[#1A1A1A]">Mô tả sản phẩm</h2>
                <p className="text-gray-600 leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              {/* Nút thêm vào giỏ */}
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>

        {/* Sản phẩm gợi ý */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="mb-10">
              <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A1A] inline-block relative">
                Có thể bạn sẽ thích
                <span
                  className="absolute -bottom-3 left-0 w-3/4 h-0.5"
                  style={{ backgroundColor: '#D4AF37' }}
                ></span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}