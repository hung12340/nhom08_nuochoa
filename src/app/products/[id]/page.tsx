import { notFound } from 'next/navigation';
import { getProductById, getAllProducts } from '@/lib/products';
import ProductGallery from '@/components/ProductGallery';

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) notFound();

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* ========== GALLERY ẢNH CHẤT LƯỢNG CAO ========== */}
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <ProductGallery images={product.images} name={product.name} />
        </div>

        {/* Thông tin cơ bản (chỉ để trang không trống) */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', color: '#1a1a1a' }}>
            {product.name}
          </h1>
          <p style={{ color: '#888', marginTop: '0.5rem' }}>{product.brand}</p>
          <p style={{ fontSize: '1.5rem', color: '#d4af37', marginTop: '1rem' }}>
            {product.price.toLocaleString('vi-VN')} ₫
          </p>
        </div>
      </div>
    </main>
  );
}