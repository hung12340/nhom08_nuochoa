'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllProducts } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';

type SortOption = 'newest' | 'price-asc' | 'price-desc';
const ITEMS_PER_PAGE = 8;

/* ========== STYLES ========== */
const S = {
  page: { minHeight: '100vh', backgroundColor: '#f9f9f9', fontFamily: '"Montserrat", sans-serif' },
  container: { maxWidth: 1280, margin: '0 auto' },
  title: { fontFamily: '"Playfair Display", serif', fontSize: '2.2rem', color: '#1a1a1a', marginBottom: '0.5rem' },
  gold: { color: '#d4af37' },
  subtitle: { color: '#666', marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 300 },
  content: { display: 'flex' },
  filterCard: { backgroundColor: '#fff', borderRadius: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.02), 0 2px 6px rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.1)' },
  filterTitle: { fontFamily: '"Playfair Display", serif', fontSize: '1.3rem', fontWeight: 500, color: '#1a1a1a', marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#1a1a1a', marginBottom: '0.4rem' },
  select: { width: '100%', padding: '0.5rem 0.6rem', backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: '0.85rem', color: '#1a1a1a', fontFamily: 'inherit', outline: 'none' },
  radioGroup: { display: 'flex', flexDirection: 'column' as const, gap: 6 },
  radioLabel: { display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.85rem', color: '#1a1a1a' },
  radio: { accentColor: '#d4af37', width: 14, height: 14 },
  clearLink: { background: 'none', border: 'none', color: '#d4af37', fontSize: '0.7rem', fontWeight: 500, textDecoration: 'underline', cursor: 'pointer', marginTop: 4, padding: 0 },
  priceRow: { display: 'flex', gap: 8 },
  priceInput: { flex: 1, padding: '0.5rem 0.6rem', backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: '0.85rem', color: '#1a1a1a', fontFamily: 'inherit', outline: 'none' },
  actions: { display: 'flex', flexDirection: 'column' as const, gap: 8, marginTop: '1rem' },
  applyBtn: { padding: '0.6rem', backgroundColor: '#d4af37', color: '#fff', border: 'none', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 4px 8px rgba(212,175,55,0.15)' },
  resetBtn: { padding: '0.6rem', backgroundColor: 'transparent', color: '#1a1a1a', border: '1px solid #ccc', borderRadius: 20, fontSize: '0.85rem', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' },
  main: { flex: 1, minWidth: 0 },
  resultBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  resultCount: { color: '#666', fontSize: '0.9rem' },
  sortSelect: { padding: '0.5rem 1.5rem 0.5rem 0.8rem', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: 30, fontSize: '0.9rem', color: '#1a1a1a', fontFamily: 'inherit', outline: 'none', cursor: 'pointer', appearance: 'none' as const, backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%231A1A1A\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><polyline points=\'6 9 12 15 18 9\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: 13 },
  productGrid: { display: 'grid', gap: 20 },
  empty: { textAlign: 'center' as const, padding: '3rem', backgroundColor: '#fff', borderRadius: 20, color: '#888', fontSize: '1rem', border: '1px solid rgba(212,175,55,0.1)' },
  mobileFilterBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '0.6rem 1.2rem', backgroundColor: '#d4af37', color: '#fff', border: 'none', borderRadius: 30, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', marginBottom: 16 },
  mobileFilterOverlay: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 },
  mobileFilterPanel: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', zIndex: 1001, padding: 20, overflowY: 'auto' as const, boxSizing: 'border-box' as const },
  mobileCloseBtn: { position: 'absolute' as const, top: 16, right: 16, background: 'none', border: '1px solid #ccc', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer', color: '#1a1a1a' },
};

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allProducts = useMemo(() => getAllProducts(), []);

  /* ---------- Responsive ---------- */
  const [screenWidth, setScreenWidth] = useState<number>(1024);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mode: 'mobile' | 'tablet' | 'desktop' =
    screenWidth < 768 ? 'mobile' : screenWidth < 1024 ? 'tablet' : 'desktop';

  // Tablet: sidebar cực gọn
  const sidebarWidth = mode === 'mobile' ? 0 : mode === 'tablet' ? 160 : 240;
  const containerPadding = mode === 'tablet' ? '1.5rem 1rem' : '2rem 1.5rem';
  const filterCardPadding = mode === 'tablet' ? '0.6rem 0.5rem' : '1.2rem 1rem';
  const filterGroupMargin = mode === 'tablet' ? '0.6rem' : '1.2rem';
  const contentGap = mode === 'mobile' ? 0 : mode === 'tablet' ? 12 : 24;

  const gridTemplateColumns =
    mode === 'mobile'
      ? '1fr'
      : mode === 'tablet'
      ? 'repeat(2, 1fr)'
      : 'repeat(auto-fill, minmax(210px, 1fr))';

  /* ---------- Filter state ---------- */
  const brand = searchParams.get('brand') || '';
  const gender = searchParams.get('gender') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = (searchParams.get('sort') as SortOption) || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  const [selBrand, setSelBrand] = useState(brand);
  const [selGender, setSelGender] = useState(gender);
  const [minInp, setMinInp] = useState(minPrice);
  const [maxInp, setMaxInp] = useState(maxPrice);

  const brands = useMemo(() => [...new Set(allProducts.map(p => p.brand))], [allProducts]);
  const genders = useMemo(() => [...new Set(allProducts.map(p => p.gender))], [allProducts]);

  const filtered = useMemo(() => {
    let f = [...allProducts];
    if (brand) f = f.filter(p => p.brand === brand);
    if (gender) f = f.filter(p => p.gender === gender);
    const min = minPrice ? parseInt(minPrice) : NaN;
    const max = maxPrice ? parseInt(maxPrice) : NaN;
    if (!isNaN(min)) f = f.filter(p => p.price >= min);
    if (!isNaN(max)) f = f.filter(p => p.price <= max);

    if (sortBy === 'price-asc') f.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') f.sort((a, b) => b.price - a.price);
    else f.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return f;
  }, [allProducts, brand, gender, minPrice, maxPrice, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const updateUrl = (updates: Record<string, string>) => {
    const p = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
    router.push(`/products?${p}`, { scroll: false });
  };

  const applyFilters = () => {
    updateUrl({ brand: selBrand, gender: selGender, minPrice: minInp, maxPrice: maxInp, page: '1' });
    setShowMobileFilter(false);
  };

  const resetFilters = () => {
    setSelBrand(''); setSelGender(''); setMinInp(''); setMaxInp('');
    updateUrl({ brand: '', gender: '', minPrice: '', maxPrice: '', sort: 'newest', page: '1' });
    setShowMobileFilter(false);
  };

  const handleSort = (s: SortOption) => updateUrl({ sort: s, page: '1' });
  const handlePage = (p: number) => { updateUrl({ page: String(p) }); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // Nội dung bộ lọc dùng chung
  const renderFilterContent = () => (
    <>
      <h2 style={S.filterTitle}>Bộ lọc</h2>
      <div style={{ marginBottom: filterGroupMargin }}>
        <label style={S.label}>Thương hiệu</label>
        <select style={S.select} value={selBrand} onChange={e => setSelBrand(e.target.value)}>
          <option value="">Tất cả</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: filterGroupMargin }}>
        <label style={S.label}>Giới tính</label>
        <div style={S.radioGroup}>
          {genders.map(g => (
            <label key={g} style={S.radioLabel}>
              <input type="radio" name="gender" value={g} checked={selGender === g} onChange={e => setSelGender(e.target.value)} style={S.radio} />{g}
            </label>
          ))}
        </div>
        {selGender && <button style={S.clearLink} onClick={() => setSelGender('')}>Xóa chọn</button>}
      </div>
      <div style={{ marginBottom: filterGroupMargin }}>
        <label style={S.label}>Khoảng giá (VNĐ)</label>
        <div style={S.priceRow}>
          <input type="number" placeholder="Từ" value={minInp} onChange={e => setMinInp(e.target.value)} style={S.priceInput} min="0" />
          <input type="number" placeholder="Đến" value={maxInp} onChange={e => setMaxInp(e.target.value)} style={S.priceInput} min="0" />
        </div>
      </div>
      <div style={S.actions}>
        <button style={S.applyBtn} onClick={applyFilters}>Áp dụng bộ lọc</button>
        <button style={S.resetBtn} onClick={resetFilters}>Xóa tất cả</button>
      </div>
    </>
  );

  return (
    <div style={S.page}>
      <div style={{ ...S.container, padding: containerPadding }}>
        <h1 style={S.title}>Bộ sưu tập <span style={S.gold}>Aromis</span></h1>
        <p style={S.subtitle}>Khám phá những mùi hương cao cấp</p>

        {mode === 'mobile' && (
          <button style={S.mobileFilterBtn} onClick={() => setShowMobileFilter(true)}>
            <span>☰</span> Lọc sản phẩm
          </button>
        )}

        <div style={{ ...S.content, gap: contentGap }}>
          {mode !== 'mobile' && (
            <aside style={{ flex: `0 0 ${sidebarWidth}px` }}>
              <div style={{ ...S.filterCard, padding: filterCardPadding }}>
                {renderFilterContent()}
              </div>
            </aside>
          )}

          <div style={S.main}>
            <div style={S.resultBar}>
              <span style={S.resultCount}>
                Hiển thị <strong style={{ color: '#1a1a1a' }}>{filtered.length}</strong> sản phẩm
              </span>
              <select style={S.sortSelect} value={sortBy} onChange={e => handleSort(e.target.value as SortOption)}>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
            </div>

            {paginated.length ? (
              <>
                <div style={{ ...S.productGrid, gridTemplateColumns }}>
                  {paginated.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePage} />
              </>
            ) : (
              <div style={S.empty}>Không tìm thấy sản phẩm phù hợp.</div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile full-screen filter */}
      {mode === 'mobile' && showMobileFilter && (
        <>
          <div style={S.mobileFilterOverlay} onClick={() => setShowMobileFilter(false)} />
          <div style={S.mobileFilterPanel}>
            <button style={S.mobileCloseBtn} onClick={() => setShowMobileFilter(false)}>✕</button>
            {renderFilterContent()}
          </div>
        </>
      )}
    </div>
  );
}