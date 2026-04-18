'use client';

import { useState, useMemo } from 'react';
import { getAllProducts, Product } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const allProducts = useMemo(() => getAllProducts(), []);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const brands = useMemo(() => [...new Set(allProducts.map(p => p.brand))], [allProducts]);
  const genders = useMemo(() => [...new Set(allProducts.map(p => p.gender))], [allProducts]);

  const applyFilters = () => {
    let filtered = [...allProducts];
    if (selectedBrand) filtered = filtered.filter(p => p.brand === selectedBrand);
    if (selectedGender) filtered = filtered.filter(p => p.gender === selectedGender);
    const min = minPrice ? parseInt(minPrice) : NaN;
    const max = maxPrice ? parseInt(maxPrice) : NaN;
    if (!isNaN(min)) filtered = filtered.filter(p => p.price >= min);
    if (!isNaN(max)) filtered = filtered.filter(p => p.price <= max);
    setFilteredProducts(filtered);
  };

  const resetFilters = () => {
    setSelectedBrand('');
    setSelectedGender('');
    setMinPrice('');
    setMaxPrice('');
    setFilteredProducts(allProducts);
  };

  // 🎨 Styles object được thiết kế tinh tế
  const styles: Record<string, React.CSSProperties> = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#F9F9F9',
      fontFamily: '"Montserrat", sans-serif',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '2.5rem 1.5rem',
    },
    title: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '2.5rem',
      color: '#1A1A1A',
      marginBottom: '0.5rem',
    },
    gold: {
      color: '#D4AF37',
    },
    subtitle: {
      color: '#666',
      marginBottom: '2rem',
      fontSize: '1.1rem',
      fontWeight: 300,
    },
    content: {
      display: 'flex',
      gap: '2rem',
      flexWrap: 'wrap',
    },
    sidebar: {
      flex: '0 0 280px',
    },
    filterCard: {
      backgroundColor: '#fff',
      borderRadius: '20px',
      padding: '1.8rem 1.5rem',
      boxShadow: '0 12px 28px rgba(0, 0, 0, 0.03), 0 2px 6px rgba(212, 175, 55, 0.05)',
      border: '1px solid rgba(212, 175, 55, 0.12)',
    },
    filterHeader: {
      fontFamily: '"Playfair Display", serif',
      fontSize: '1.8rem',
      fontWeight: 500,
      color: '#1A1A1A',
      marginBottom: '1.8rem',
      letterSpacing: '-0.01em',
    },
    filterGroup: {
      marginBottom: '1.8rem',
    },
    label: {
      display: 'block',
      fontSize: '0.8rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: '#1A1A1A',
      marginBottom: '0.6rem',
    },
    select: {
      width: '100%',
      padding: '0.8rem 1rem',
      backgroundColor: '#F9F9F9',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      fontSize: '0.95rem',
      color: '#1A1A1A',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'border 0.2s, box-shadow 0.2s',
    },
    radioGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
      fontSize: '0.95rem',
      color: '#1A1A1A',
    },
    radio: {
      accentColor: '#D4AF37',
      width: '18px',
      height: '18px',
    },
    clearLink: {
      background: 'none',
      border: 'none',
      color: '#D4AF37',
      fontSize: '0.8rem',
      fontWeight: 500,
      textDecoration: 'underline',
      cursor: 'pointer',
      marginTop: '0.5rem',
      padding: 0,
    },
    priceRow: {
      display: 'flex',
      gap: '0.8rem',
    },
    priceInput: {
      flex: 1,
      padding: '0.8rem 1rem',
      backgroundColor: '#F9F9F9',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      fontSize: '0.95rem',
      color: '#1A1A1A',
      fontFamily: 'inherit',
      outline: 'none',
    },
    actions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.8rem',
      marginTop: '2rem',
    },
    applyBtn: {
      padding: '0.9rem',
      backgroundColor: '#D4AF37',
      color: '#fff',
      border: 'none',
      borderRadius: '40px',
      fontSize: '1rem',
      fontWeight: 600,
      fontFamily: 'inherit',
      cursor: 'pointer',
      transition: 'background 0.2s, transform 0.1s',
      boxShadow: '0 4px 8px rgba(212, 175, 55, 0.2)',
    },
    resetBtn: {
      padding: '0.9rem',
      backgroundColor: 'transparent',
      color: '#1A1A1A',
      border: '1px solid #ccc',
      borderRadius: '40px',
      fontSize: '1rem',
      fontWeight: 500,
      fontFamily: 'inherit',
      cursor: 'pointer',
      transition: 'background 0.2s, border 0.2s',
    },
    main: {
      flex: 1,
      minWidth: 0,
    },
    resultBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: '1.8rem',
    },
    resultCount: {
      color: '#666',
      fontSize: '0.95rem',
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '1.8rem',
    },
    empty: {
      textAlign: 'center',
      padding: '3.5rem',
      backgroundColor: '#fff',
      borderRadius: '24px',
      color: '#888',
      fontSize: '1rem',
      border: '1px solid rgba(212, 175, 55, 0.1)',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>
          Bộ sưu tập <span style={styles.gold}>Aromis</span>
        </h1>
        <p style={styles.subtitle}>Khám phá những mùi hương cao cấp</p>

        <div style={styles.content}>
          {/* SIDEBAR FILTER */}
          <aside style={styles.sidebar}>
            <div style={styles.filterCard}>
              <h2 style={styles.filterHeader}>Bộ lọc</h2>

              {/* Brand */}
              <div style={styles.filterGroup}>
                <label style={styles.label}>Thương hiệu</label>
                <select
                  style={styles.select}
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  <option value="">Tất cả thương hiệu</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Gender */}
              <div style={styles.filterGroup}>
                <label style={styles.label}>Giới tính</label>
                <div style={styles.radioGroup}>
                  {genders.map(g => (
                    <label key={g} style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={selectedGender === g}
                        onChange={(e) => setSelectedGender(e.target.value)}
                        style={styles.radio}
                      />
                      {g}
                    </label>
                  ))}
                </div>
                {selectedGender && (
                  <button style={styles.clearLink} onClick={() => setSelectedGender('')}>
                    Xóa chọn
                  </button>
                )}
              </div>

              {/* Price */}
              <div style={styles.filterGroup}>
                <label style={styles.label}>Khoảng giá (VNĐ)</label>
                <div style={styles.priceRow}>
                  <input
                    type="number"
                    placeholder="Từ"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={styles.priceInput}
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={styles.priceInput}
                    min="0"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={styles.actions}>
                <button style={styles.applyBtn} onClick={applyFilters}>
                  Áp dụng bộ lọc
                </button>
                <button style={styles.resetBtn} onClick={resetFilters}>
                  Xóa tất cả
                </button>
              </div>
            </div>
          </aside>

          {/* PRODUCT LIST */}
          <div style={styles.main}>
            <div style={styles.resultBar}>
              <span style={styles.resultCount}>
                Hiển thị <strong style={{ color: '#1A1A1A' }}>{filteredProducts.length}</strong> sản phẩm
              </span>
              {/* Có thể thêm dropdown sắp xếp ở đây sau */}
            </div>

            {filteredProducts.length > 0 ? (
              <div style={styles.productGrid}>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div style={styles.empty}>
                Không tìm thấy sản phẩm phù hợp.<br />
                <span style={{ fontSize: '0.9rem', marginTop: '0.5rem', display: 'block' }}>Hãy thử điều chỉnh bộ lọc.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}