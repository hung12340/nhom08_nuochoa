import { notFound } from 'next/navigation';
import { getProductById, getRelatedProducts, getAllProducts } from '@/lib/products';
import ProductGallery from '@/components/ProductGallery';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) notFound();

  const relatedProducts = getRelatedProducts(product.id, product.gender, 4);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', fontFamily: '"Montserrat", sans-serif' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#888' }}>
          <a href="/" style={{ color: '#1a1a1a', textDecoration: 'none' }}>Trang chủ</a> /{' '}
          <a href="/products" style={{ color: '#1a1a1a', textDecoration: 'none' }}>Sản phẩm</a> /{' '}
          <span style={{ color: '#d4af37' }}>{product.name}</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
          <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
            <ProductGallery images={product.images} name={product.name} />
          </div>

          <div style={{ flex: '1 1 45%', minWidth: '300px' }}>
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 12px 28px rgba(0,0,0,0.02)',
                border: '1px solid rgba(212,175,55,0.1)',
              }}
            >
              <div
                style={{
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#888',
                  marginBottom: '0.5rem',
                }}
              >
                {product.brand}
              </div>
              <h1
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '2.5rem',
                  color: '#1a1a1a',
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                }}
              >
                {product.name}
              </h1>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: '#d4af37',
                  marginBottom: '2rem',
                }}
              >
                {product.price.toLocaleString('vi-VN')} ₫
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
                  <span style={{ width: '100px', fontWeight: 500, color: '#1a1a1a' }}>Dung tích</span>
                  <span style={{ color: '#444' }}>{product.volume}</span>
                </div>
                <div style={{ display: 'flex', marginBottom: '0.5rem' }}>
                  <span style={{ width: '100px', fontWeight: 500, color: '#1a1a1a' }}>Giới tính</span>
                  <span style={{ color: '#444' }}>{product.gender}</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: '100px', fontWeight: 500, color: '#1a1a1a' }}>Tình trạng</span>
                  <span style={{ color: product.stock > 0 ? '#2e7d32' : '#c62828', fontWeight: 500 }}>
                    {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
                  </span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                <h2
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '1.5rem',
                    color: '#1a1a1a',
                    marginBottom: '1rem',
                    position: 'relative',
                    display: 'inline-block',
                  }}
                >
                  Mô tả sản phẩm
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: 0,
                      width: '60%',
                      height: '2px',
                      backgroundColor: '#d4af37',
                    }}
                  />
                </h2>
                <p
                  style={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontSize: '1rem',
                    lineHeight: 1.8,
                    color: '#444',
                    marginTop: '1.5rem',
                  }}
                >
                  {product.description}
                </p>
                <p
                  style={{
                    marginTop: '1.5rem',
                    fontSize: '0.9rem',
                    color: '#888',
                    fontStyle: 'italic',
                  }}
                >
                  * Sản phẩm chính hãng 100%. Mùi hương có thể thay đổi tùy theo cơ địa.
                </p>
              </div>

              <AddToCartButton product={product} />
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section style={{ marginTop: '4rem' }}>
            <h2
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '2rem',
                color: '#1a1a1a',
                marginBottom: '1.5rem',
                position: 'relative',
                display: 'inline-block',
              }}
            >
              Có thể bạn sẽ thích
              <span
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  width: '70%',
                  height: '2px',
                  backgroundColor: '#d4af37',
                }}
              />
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.8rem',
                marginTop: '2rem',
              }}
            >
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