'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      style={{
        background: 'none', border: '1px solid #e0e0e0', borderRadius: '30px', padding: '0.4rem 1.2rem',
        fontSize: '0.9rem', fontFamily: '"Montserrat", sans-serif', color: '#1a1a1a', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s', marginRight: '1.5rem',
      }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5f5f5'; e.currentTarget.style.borderColor = '#d4af37'; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#e0e0e0'; }}
    >
      ← Quay lại
    </button>
  );
}