import { request } from '@/api/request';
import { GetProductResult, Product } from '@/interface/product/product.interface';
import { RequestParams } from '@/interface';

/** get Product list api */

export const apiGetProductList = (
  params: RequestParams = {
    offset: 1,
    limit: 10,
  },
) => request<GetProductResult>('get', '/public/products', {}, { baseURL: import.meta.env.VITE_API_URL, params });

// Get Product Detail
export const apiGetProductItem = (id: string) =>
  request<GetProductResult>('get', '/products/private/' + id, {}, { baseURL: import.meta.env.VITE_API_URL });

// Add Product
export const apiAddProduct = (data: Partial<Product>) =>
  request<GetProductResult>('post', '/products', data, { baseURL: import.meta.env.VITE_API_URL });

// Update Product
export const apiUpdateProduct = (id: string, data: Partial<Product>) =>
  request<GetProductResult>('put', '/products/' + id, data, { baseURL: import.meta.env.VITE_API_URL });

// Delete Product
export const apiDeleteProduct = (id: string) =>
  request<GetProductResult>('delete', '/private/products/' + id, {}, { baseURL: import.meta.env.VITE_API_URL });

export const apiSearchProduct = (
  params: RequestParams = {
    offset: 1,
    limit: 10,
  },
) => request<GetProductResult>('get', '/public/products/search', {}, { baseURL: import.meta.env.VITE_API_URL, params });
