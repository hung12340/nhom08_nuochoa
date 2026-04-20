'use client';

import { useState, useMemo, Suspense } from 'react'; 
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllProducts, Product } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';

type SortOption = 'newest' | 'price-asc' | 'price-desc';
const ITEMS_PER_PAGE = 9;

// Style object tập trung – giữ nguyên toàn bộ thiết kế đẹp
const S = {
  page: { minHeight: '100vh', backgroundColor: '#f9f9f9', fontFamily: '"Montserrat", sans-serif' },
  container: { maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' },
  title: { fontFamily: '"Playfair Display", serif', fontSize: '2.2rem', color: '#1a1a1a', marginBottom: '0.5rem' },
  gold: { color: '#d4af37' },
  subtitle: { color: '#666', marginBottom: '2rem', fontSize: '1rem', fontWeight: 300 },
  content: { display: 'flex', gap: '2rem', flexWrap: 'wrap' as const },
  sidebar: { flex: '0 0 240px' },
  filterCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '1.2rem 1rem', boxShadow: '0 8px 20px rgba(0,0,0,0.02), 0 2px 6px rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.1)' },
  filterTitle: { fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', fontWeight: 500, color: '#1a1a1a', marginBottom: '1.4rem' },
  filterGroup: { marginBottom: '1.4rem' },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: '#1a1a1a', marginBottom: '0.5rem' },
  select: { width: '100%', padding: '0.6rem 0.8rem', backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '0.9rem', color: '#1a1a1a', fontFamily: 'inherit', outline: 'none' },
  radioGroup: { display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' },
  radioLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#1a1a1a' },
  radio: { accentColor: '#d4af37', width: 16, height: 16 },
  clearLink: { background: 'none', border: 'none', color: '#d4af37', fontSize: '0.75rem', fontWeight: 500, textDecoration: 'underline', cursor: 'pointer', marginTop: '0.4rem', padding: 0 },
  priceRow: { display: 'flex', gap: '0.6rem' },
  priceInput: { flex: 1, padding: '0.6rem 0.8rem', backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '0.9rem', color: '#1a1a1a', fontFamily: 'inherit', outline: 'none' },
  actions: { display: 'flex', flexDirection: 'column' as const, gap: '0.6rem', marginTop: '1.5rem' },
  applyBtn: { padding: '0.7rem', backgroundColor: '#d4af37', color: '#fff', border: 'none', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 4px 8px rgba(212,175,55,0.15)' },
  resetBtn: { padding: '0.7rem', backgroundColor: 'transparent', color: '#1a1a1a', border: '1px solid #ccc', borderRadius: '30px', fontSize: '0.9rem', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer' },
  main: { flex: 1, minWidth: 0 },
  resultBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  resultCount: { color: '#666', fontSize: '0.9rem' },
  sortSelect: { padding: '0.5rem 1.8rem 0.5rem 0.8rem', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '30px', fontSize: '0.9rem', color: '#1a1a1a', fontFamily: 'inherit', outline: 'none', cursor: 'pointer', appearance: 'none' as const, backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%231A1A1A\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><polyline points=\'6 9 12 15 18 9\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.6rem center', backgroundSize: '14px' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' },
  empty: { textAlign: 'center' as const, padding: '3rem', backgroundColor: '#fff', borderRadius: '20px', color: '#888', fontSize: '1rem', border: '1px solid rgba(212,175,55,0.1)' },
};

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allProducts = useMemo(() => getAllProducts(), []);

  // URL params
  const brand = searchParams.get('brand') || '';
  const gender = searchParams.get('gender') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = (searchParams.get('sort') as SortOption) || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  // UI state (độc lập với URL, chỉ merge khi Apply)
  const [selBrand, setSelBrand] = useState(brand);
  const [selGender, setSelGender] = useState(gender);
  const [minInp, setMinInp] = useState(minPrice);
  const [maxInp, setMaxInp] = useState(maxPrice);

  // Danh sách options
  const brands = useMemo(() => [...new Set(allProducts.map(p => p.brand))], [allProducts]);
  const genders = useMemo(() => [...new Set(allProducts.map(p => p.gender))], [allProducts]);

  // Lọc & sắp xếp tập trung (dùng useMemo, không cần useEffect)
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    if (brand) filtered = filtered.filter(p => p.brand === brand);
    if (gender) filtered = filtered.filter(p => p.gender === gender);
    const min = minPrice ? parseInt(minPrice) : NaN;
    const max = maxPrice ? parseInt(maxPrice) : NaN;
    if (!isNaN(min)) filtered = filtered.filter(p => p.price >= min);
    if (!isNaN(max)) filtered = filtered.filter(p => p.price <= max);

    switch (sortBy) {
      case 'price-asc': return filtered.sort((a, b) => a.price - b.price);
      case 'price-desc': return filtered.sort((a, b) => b.price - a.price);
      default: return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [allProducts, brand, gender, minPrice, maxPrice, sortBy]);

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginated = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Helper cập nhật URL
  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => v ? params.set(k, v) : params.delete(k));
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // Actions
  const applyFilters = () => updateUrl({ brand: selBrand, gender: selGender, minPrice: minInp, maxPrice: maxInp, page: '1' });
  const resetFilters = () => {
    setSelBrand(''); setSelGender(''); setMinInp(''); setMaxInp('');
    updateUrl({ brand: '', gender: '', minPrice: '', maxPrice: '', sort: 'newest', page: '1' });
  };
  const handleSort = (s: SortOption) => updateUrl({ sort: s, page: '1' });
  const handlePage = (p: number) => { updateUrl({ page: String(p) }); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div style={S.page}>
      <div style={S.container}>
        <h1 style={S.title}>Bộ sưu tập <span style={S.gold}>Aromis</span></h1>
        <p style={S.subtitle}>Khám phá những mùi hương cao cấp</p>

        <div style={S.content}>
          {/* Sidebar Filter */}
          <aside style={S.sidebar}>
            <div style={S.filterCard}>
              <h2 style={S.filterTitle}>Bộ lọc</h2>

              <div style={S.filterGroup}>
                <label style={S.label}>Thương hiệu</label>
                <select style={S.select} value={selBrand} onChange={e => setSelBrand(e.target.value)}>
                  <option value="">Tất cả</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div style={S.filterGroup}>
                <label style={S.label}>Giới tính</label>
                <div style={S.radioGroup}>
                  {genders.map(g => (
                    <label key={g} style={S.radioLabel}>
                      <input type="radio" name="gender" value={g} checked={selGender === g} onChange={e => setSelGender(e.target.value)} style={S.radio} />
                      {g}
                    </label>
                  ))}
                </div>
                {selGender && <button style={S.clearLink} onClick={() => setSelGender('')}>Xóa chọn</button>}
              </div>

              <div style={S.filterGroup}>
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
            </div>
          </aside>

          {/* Main Content */}
          <div style={S.main}>
            <div style={S.resultBar}>
              <span style={S.resultCount}>Hiển thị <strong style={{ color: '#1a1a1a' }}>{filteredProducts.length}</strong> sản phẩm</span>
              <select style={S.sortSelect} value={sortBy} onChange={e => handleSort(e.target.value as SortOption)}>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
            </div>

            {paginated.length > 0 ? (
              <>
                <div style={S.productGrid}>{paginated.map(p => <ProductCard key={p.id} product={p} />)}</div>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePage} />
              </>
            ) : (
              <div style={S.empty}>Không tìm thấy sản phẩm phù hợp.<br /><span style={{ fontSize: '0.9rem', marginTop: '0.5rem', display: 'block' }}>Hãy thử điều chỉnh bộ lọc.</span></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
        <p style={{ fontFamily: '"Playfair Display", serif', color: '#d4af37', fontSize: '1.2rem' }}>
          Đang chuẩn bị không gian mùi hương Aromis...
        </p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
