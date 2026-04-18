'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllProducts, Product } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';

type SortOption = 'newest' | 'price-asc' | 'price-desc';
const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allProducts = useMemo(() => getAllProducts(), []);

  const brand = searchParams.get('brand') || '';
  const gender = searchParams.get('gender') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = (searchParams.get('sort') as SortOption) || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const brands = useMemo(() => [...new Set(allProducts.map(p => p.brand))], [allProducts]);
  const genders = useMemo(() => [...new Set(allProducts.map(p => p.gender))], [allProducts]);

  const [selectedBrand, setSelectedBrand] = useState(brand);
  const [selectedGender, setSelectedGender] = useState(gender);
  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);

  useEffect(() => {
    setSelectedBrand(brand);
    setSelectedGender(gender);
    setMinPriceInput(minPrice);
    setMaxPriceInput(maxPrice);
  }, [brand, gender, minPrice, maxPrice]);

  const updateUrlParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    let filtered = [...allProducts];
    if (brand) filtered = filtered.filter(p => p.brand === brand);
    if (gender) filtered = filtered.filter(p => p.gender === gender);
    const min = minPrice ? parseInt(minPrice) : NaN;
    const max = maxPrice ? parseInt(maxPrice) : NaN;
    if (!isNaN(min)) filtered = filtered.filter(p => p.price >= min);
    if (!isNaN(max)) filtered = filtered.filter(p => p.price <= max);

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    setFilteredProducts(filtered);
  }, [brand, gender, minPrice, maxPrice, sortBy, allProducts]);

  const applyFilters = () => {
    updateUrlParams({
      brand: selectedBrand,
      gender: selectedGender,
      minPrice: minPriceInput,
      maxPrice: maxPriceInput,
      page: '1',
    });
  };

  const resetFilters = () => {
    setSelectedBrand('');
    setSelectedGender('');
    setMinPriceInput('');
    setMaxPriceInput('');
    updateUrlParams({
      brand: '',
      gender: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      page: '1',
    });
  };

  const handleSortChange = (newSort: SortOption) => {
    updateUrlParams({ sort: newSort, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        fontFamily: '"Montserrat", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '2rem 1.5rem',
        }}
      >
        <h1
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '2.2rem',
            color: '#1a1a1a',
            marginBottom: '0.5rem',
          }}
        >
          Bộ sưu tập <span style={{ color: '#d4af37' }}>Aromis</span>
        </h1>
        <p
          style={{
            color: '#666',
            marginBottom: '2rem',
            fontSize: '1rem',
            fontWeight: 300,
          }}
        >
          Khám phá những mùi hương cao cấp
        </p>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Sidebar Filter - Nhỏ gọn hơn */}
          <aside style={{ flex: '0 0 240px' }}>
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                padding: '1.2rem 1rem',
                boxShadow: '0 8px 20px rgba(0,0,0,0.02), 0 2px 6px rgba(212,175,55,0.03)',
                border: '1px solid rgba(212,175,55,0.1)',
              }}
            >
              <h2
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  color: '#1a1a1a',
                  marginBottom: '1.4rem',
                  letterSpacing: '-0.01em',
                }}
              >
                Bộ lọc
              </h2>

              <div style={{ marginBottom: '1.4rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#1a1a1a',
                    marginBottom: '0.5rem',
                  }}
                >
                  Thương hiệu
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    color: '#1a1a1a',
                    fontFamily: 'inherit',
                    outline: 'none',
                  }}
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.4rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#1a1a1a',
                    marginBottom: '0.5rem',
                  }}
                >
                  Giới tính
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {genders.map((g) => (
                    <label
                      key={g}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: '#1a1a1a',
                      }}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={selectedGender === g}
                        onChange={(e) => setSelectedGender(e.target.value)}
                        style={{ accentColor: '#d4af37', width: 16, height: 16 }}
                      />
                      {g}
                    </label>
                  ))}
                </div>
                {selectedGender && (
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#d4af37',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      marginTop: '0.4rem',
                      padding: 0,
                    }}
                    onClick={() => setSelectedGender('')}
                  >
                    Xóa chọn
                  </button>
                )}
              </div>

              <div style={{ marginBottom: '1.4rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#1a1a1a',
                    marginBottom: '0.5rem',
                  }}
                >
                  Khoảng giá (VNĐ)
                </label>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <input
                    type="number"
                    placeholder="Từ"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.6rem 0.8rem',
                      backgroundColor: '#f9f9f9',
                      border: '1px solid #e0e0e0',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      color: '#1a1a1a',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.6rem 0.8rem',
                      backgroundColor: '#f9f9f9',
                      border: '1px solid #e0e0e0',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      color: '#1a1a1a',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                    min="0"
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  marginTop: '1.5rem',
                }}
              >
                <button
                  style={{
                    padding: '0.7rem',
                    backgroundColor: '#d4af37',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '30px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(212,175,55,0.15)',
                  }}
                  onClick={applyFilters}
                >
                  Áp dụng bộ lọc
                </button>
                <button
                  style={{
                    padding: '0.7rem',
                    backgroundColor: 'transparent',
                    color: '#1a1a1a',
                    border: '1px solid #ccc',
                    borderRadius: '30px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}
                  onClick={resetFilters}
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ color: '#666', fontSize: '0.9rem' }}>
                Hiển thị <strong style={{ color: '#1a1a1a' }}>{filteredProducts.length}</strong> sản phẩm
              </span>
              <select
                style={{
                  padding: '0.5rem 1.8rem 0.5rem 0.8rem',
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '30px',
                  fontSize: '0.9rem',
                  color: '#1a1a1a',
                  fontFamily: 'inherit',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage:
                    'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%231A1A1A\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><polyline points=\'6 9 12 15 18 9\'/></svg>")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.6rem center',
                  backgroundSize: '14px',
                }}
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
            </div>

            {paginatedProducts.length > 0 ? (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '1.5rem',
                  }}
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem',
                  backgroundColor: '#fff',
                  borderRadius: '20px',
                  color: '#888',
                  fontSize: '1rem',
                  border: '1px solid rgba(212,175,55,0.1)',
                }}
              >
                Không tìm thấy sản phẩm phù hợp.<br />
                <span style={{ fontSize: '0.9rem', marginTop: '0.5rem', display: 'block' }}>
                  Hãy thử điều chỉnh bộ lọc.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}