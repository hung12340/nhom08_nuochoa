'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllProducts, Product } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';

const ITEMS_PER_PAGE = 8;

// Custom hook debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allProducts] = useState<Product[]>(getAllProducts());
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);

  const brand = searchParams.get('brand') || '';
  const gender = searchParams.get('gender') || '';
  const sortBy = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const minPriceFromUrl = searchParams.get('minPrice') || '';
  const maxPriceFromUrl = searchParams.get('maxPrice') || '';

  const [minPriceInput, setMinPriceInput] = useState(minPriceFromUrl);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPriceFromUrl);

  const debouncedMinPrice = useDebounce(minPriceInput, 500);
  const debouncedMaxPrice = useDebounce(maxPriceInput, 500);

  useEffect(() => {
    setMinPriceInput(minPriceFromUrl);
    setMaxPriceInput(maxPriceFromUrl);
  }, [minPriceFromUrl, maxPriceFromUrl]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedMinPrice) params.set('minPrice', debouncedMinPrice);
    else params.delete('minPrice');
    if (debouncedMaxPrice) params.set('maxPrice', debouncedMaxPrice);
    else params.delete('maxPrice');
    params.set('page', '1');
    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [debouncedMinPrice, debouncedMaxPrice]);

  const brands = useMemo(() => [...new Set(allProducts.map(p => p.brand))], [allProducts]);
  const genders = useMemo(() => [...new Set(allProducts.map(p => p.gender))], [allProducts]);

  useEffect(() => {
    let result = [...allProducts];
    if (brand) result = result.filter(p => p.brand === brand);
    if (gender) result = result.filter(p => p.gender === gender);

    const min = minPriceFromUrl ? parseInt(minPriceFromUrl, 10) : NaN;
    const max = maxPriceFromUrl ? parseInt(maxPriceFromUrl, 10) : NaN;
    if (!isNaN(min) && min >= 0) result = result.filter(p => p.price >= min);
    if (!isNaN(max) && max >= 0) result = result.filter(p => p.price <= max);

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredProducts(result);
  }, [brand, gender, minPriceFromUrl, maxPriceFromUrl, sortBy, allProducts]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FDFBF7 0%, #F4EFE6 100%)' }}>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4 tracking-tight">
          Bộ sưu tập <span className="text-[#D4AF37]">Aromis</span>
        </h1>
        <p className="text-gray-600 mb-10 font-light max-w-2xl">
          Khám phá những mùi hương cao cấp được tuyển chọn dành riêng cho bạn
        </p>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="lg:w-1/4">
            <div
              className="rounded-2xl p-6 shadow-sm backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.75)', border: '1px solid rgba(212,175,55,0.15)' }}
            >
              <h2 className="font-serif text-2xl text-[#1A1A1A] mb-5">Bộ lọc</h2>

              <div className="mb-6">
                <h3 className="font-medium text-[#1A1A1A] mb-2 text-sm uppercase tracking-wider">Thương hiệu</h3>
                <select
                  className="w-full border border-gray-200 rounded-lg p-3 bg-white/90 text-[#1A1A1A] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  value={brand}
                  onChange={(e) => updateSearchParams('brand', e.target.value)}
                >
                  <option value="">Tất cả thương hiệu</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-[#1A1A1A] mb-2 text-sm uppercase tracking-wider">Giới tính</h3>
                <div className="space-y-2">
                  {genders.map(g => (
                    <label key={g} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={gender === g}
                        onChange={(e) => updateSearchParams('gender', e.target.value)}
                        className="mr-3 accent-[#D4AF37] w-4 h-4"
                      />
                      <span className="text-[#1A1A1A]">{g}</span>
                    </label>
                  ))}
                </div>
                {gender && (
                  <button
                    onClick={() => updateSearchParams('gender', '')}
                    className="text-sm text-[#D4AF37] underline mt-2 hover:text-amber-600"
                  >
                    Xóa chọn
                  </button>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-[#1A1A1A] mb-2 text-sm uppercase tracking-wider">Khoảng giá (VNĐ)</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    min="0"
                    className="w-1/2 border border-gray-200 rounded-lg p-3 bg-white/90 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    min="0"
                    className="w-1/2 border border-gray-200 rounded-lg p-3 bg-white/90 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Tự động áp dụng sau khi dừng gõ</p>
              </div>

              <button
                onClick={() => router.push('/products')}
                className="w-full bg-[#1A1A1A] text-white py-3 rounded-lg font-medium hover:bg-[#D4AF37] transition duration-300"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="flex flex-wrap justify-between items-center mb-8">
              <p className="text-gray-600 font-light">
                Hiển thị <span className="font-medium text-[#1A1A1A]">{filteredProducts.length}</span> sản phẩm
              </p>
              <select
                className="border border-gray-200 rounded-lg p-3 bg-white/90 text-[#1A1A1A] focus:ring-2 focus:ring-[#D4AF37]"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
              </select>
            </div>

            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/40 rounded-2xl backdrop-blur-sm">
                <p className="text-xl text-gray-500 font-light">Không tìm thấy sản phẩm phù hợp</p>
              </div>
            )}

            <div className="mt-12">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}