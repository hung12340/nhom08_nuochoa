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
}

export const products: Product[] = productsData as Product[];

export const getAllProducts = () => products;