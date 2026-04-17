import { notFound } from 'next/navigation';
import { getProductById, getRelatedProducts, getAllProducts } from '@/lib/products';
import ProductGallery from '@/components/ProductGallery';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({ id: product.id }));
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) notFound();

  const relatedProducts = getRelatedProducts(product.id, product.gender, 4);

  return (
    <main className="min-h-screen" style={{ background: '#F9F9F9' }}>
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Gallery */}
          <div className="lg:w-1/2">
            <div
              className="rounded-3xl p-4 shadow-xl"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <ProductGallery images={product.images} name={product.name} />
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div
              className="rounded-2xl p-8 md:p-10 shadow-sm"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(212,175,55,0.15)' }}
            >
              <h1 className="font-serif text-4xl md:text-5xl text-[#1A1A1A] mb-2 leading-tight">
                {product.name}
              </h1>
              <p className="text-lg text-gray-500 mb-1">{product.brand}</p>
              <div className="text-3xl font-semibold text-[#D4AF37] my-5">
                {product.price.toLocaleString('vi-VN')} ₫
              </div>

              <div className="space-y-2 text-[#1A1A1A] mb-6">
                <p><span className="font-medium">Dung tích:</span> {product.volume}</p>
                <p><span className="font-medium">Giới tính:</span> {product.gender}</p>
                <p>
                  <span className="font-medium">Tình trạng:</span>{' '}
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-medium">Còn hàng ({product.stock} sản phẩm)</span>
                  ) : (
                    <span className="text-red-500">Hết hàng</span>
                  )}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6 mb-8">
                <h2 className="font-serif text-xl mb-3 text-[#1A1A1A]">Mô tả sản phẩm</h2>
                <p className="text-gray-600 leading-relaxed font-light">{product.description}</p>
              </div>

              <AddToCartButton product={product} />
            </div>
          </div>
        </div>

        {/* Sản phẩm gợi ý */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-serif text-3xl text-[#1A1A1A] mb-8 relative inline-block">
              Có thể bạn sẽ thích
              <span className="absolute -bottom-2 left-0 w-2/3 h-0.5 bg-[#D4AF37]"></span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}