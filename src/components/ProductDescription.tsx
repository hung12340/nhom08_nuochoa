// src/components/ProductDescription.tsx
import { Product } from '@/lib/products';

interface ProductDescriptionProps {
  product: Product;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '24px',
        padding: '2rem',
        boxShadow: '0 12px 28px rgba(0,0,0,0.02)',
        border: '1px solid rgba(212,175,55,0.1)',
      }}
    >
      {/* Tiêu đề */}
      <h2
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '1.8rem',
          color: '#1a1a1a',
          marginBottom: '1.5rem',
          position: 'relative',
          display: 'inline-block',
        }}
      >
        Mô tả sản phẩm
        <span
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: 0,
            width: '60%',
            height: '2px',
            backgroundColor: '#d4af37',
          }}
        />
      </h2>

      {/* Nội dung mô tả */}
      <div
        style={{
          fontFamily: '"Montserrat", sans-serif',
          fontSize: '1rem',
          lineHeight: 1.8,
          color: '#444',
        }}
      >
        <p style={{ marginBottom: '1.5rem' }}>{product.description}</p>

        {/* Thông tin bổ sung (tùy chọn) */}
        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#fafafa',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.03)',
          }}
        >
          <h3
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '1.2rem',
              color: '#1a1a1a',
              marginBottom: '1rem',
            }}
          >
            Chi tiết
          </h3>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#d4af37', fontSize: '1.2rem' }}>◆</span>
              <span>
                <strong style={{ color: '#1a1a1a' }}>Thương hiệu:</strong> {product.brand}
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#d4af37', fontSize: '1.2rem' }}>◆</span>
              <span>
                <strong style={{ color: '#1a1a1a' }}>Dung tích:</strong> {product.volume}
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#d4af37', fontSize: '1.2rem' }}>◆</span>
              <span>
                <strong style={{ color: '#1a1a1a' }}>Giới tính:</strong> {product.gender}
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#d4af37', fontSize: '1.2rem' }}>◆</span>
              <span>
                <strong style={{ color: '#1a1a1a' }}>Tình trạng:</strong>{' '}
                <span style={{ color: product.stock > 0 ? '#2e7d32' : '#c62828', fontWeight: 500 }}>
                  {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
                </span>
              </span>
            </li>
          </ul>
        </div>

        {/* Ghi chú (tùy chọn) */}
        <p
          style={{
            marginTop: '1.5rem',
            fontSize: '0.9rem',
            color: '#888',
            fontStyle: 'italic',
          }}
        >
          * Sản phẩm chính hãng 100%. Mùi hương có thể thay đổi tùy theo cơ địa mỗi người.
        </p>
      </div>
    </div>
  );
}