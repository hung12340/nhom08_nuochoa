import productsData from '@/lib/data.json';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  volume: string;
  gender: string;
  description: string;
  images: string[];
  stock: number;
  createdAt: string;   // ✅ Thêm dòng này
}

export const products: Product[] = productsData as Product[];

export const getAllProducts = (): Product[] => products;

export const getProductById = (id: string): Product | undefined =>
  products.find(p => p.id === id);

export const getRelatedProducts = (currentId: string, gender?: string, limit = 4): Product[] =>
  products
    .filter(p => p.id !== currentId && (gender ? p.gender === gender : true))
    .slice(0, limit);