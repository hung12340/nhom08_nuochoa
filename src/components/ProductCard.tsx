import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';

export default function ProductCard({ product }: { product: Product }) {
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.02)',
    border: '1px solid rgba(212, 175, 55, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    height: '100%', 
  };

  const imageWrapperStyle: React.CSSProperties = {
    position: 'relative',
    aspectRatio: '1 / 1',
    backgroundColor: '#fafafa',
    width: '100%',
  };

  const infoStyle: React.CSSProperties = {
    padding: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  };

  const brandStyle: React.CSSProperties = {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#888',
    marginBottom: '0.5rem',
    fontFamily: '"Montserrat", sans-serif',
  };

  const nameStyle: React.CSSProperties = {
    fontFamily: '"Playfair Display", serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#1A1A1A',
    marginBottom: '0.75rem',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word',
  };

  const priceStyle: React.CSSProperties = {
    fontFamily: '"Montserrat", sans-serif',
    fontWeight: 500,
    color: '#D4AF37',
    marginTop: 'auto', 
  };

  return (
    <Link
      href={`/products/${product.id}`}
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 18px 28px rgba(212, 175, 55, 0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.02)';
      }}
    >
      <div style={imageWrapperStyle}>
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div style={infoStyle}>
        <div style={brandStyle}>{product.brand}</div>
        <h3 style={nameStyle}>{product.name}</h3>
        <div style={priceStyle}>{product.price.toLocaleString('vi-VN')} ₫</div>
      </div>
    </Link>
  );
}