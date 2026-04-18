import { getAllProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1rem', background: '#F9F9F9', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', color: '#1A1A1A' }}>
        Bộ sưu tập <span style={{ color: '#D4AF37' }}>Aromis</span>
      </h1>
      <p style={{ fontFamily: 'Montserrat, sans-serif', color: '#666', marginBottom: '2rem' }}>
        Khám phá những mùi hương cao cấp
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}