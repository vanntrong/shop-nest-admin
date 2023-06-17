import { request } from '@/api/request';
import { Category, GetCategoryResult } from '@/interface/category/category.interface';
import { RequestParams } from '@/interface';

/** get Category list api */

export const apiGetCategoryList = (
  params: RequestParams = {
    offset: 1,
    limit: 10,
    sort_by: 'id',
    sort_order: 'ASC',
  },
) => request<GetCategoryResult>('get', '/public/categories', {}, { baseURL: import.meta.env.VITE_API_URL, params });

// get Category Detail
export const apiGetCategoryItem = (id: string) =>
  request<GetCategoryResult>('get', '/categories/private/' + id, {}, { baseURL: import.meta.env.VITE_API_URL });

// get parent categories
export const apiGetParentCategories = () =>
  request<GetCategoryResult>('get', '/categories/private/parent', {}, { baseURL: import.meta.env.VITE_API_URL });

// Add Category
export const apiAddCategory = (data: Category) =>
  request<GetCategoryResult>('post', '/categories', data, { baseURL: import.meta.env.VITE_API_URL });

// Update Category
export const apiUpdateCategory = (id: string, data: Category) =>
  request<GetCategoryResult>('put', '/categories/' + id, data, { baseURL: import.meta.env.VITE_API_URL });

// Delte Category
export const apiDeleteCategory = (id: string) =>
  request<GetCategoryResult>('delete', '/categories/' + id, {}, { baseURL: import.meta.env.VITE_API_URL });

// For Combobox
export const apiGetCategorySelectBox = (
  params: RequestParams & { type?: string; rank?: number } = {
    offset: 0,
    limit: 999999,
    sort_by: 'id',
    sort_order: 'ASC',
  },
) => request<GetCategoryResult>('get', '/categories', {}, { baseURL: import.meta.env.VITE_API_URL, params });
export const apiSearchCategory = (
  params: RequestParams = {
    offset: 1,
    limit: 10,
    sort_by: 'id',
    sort_order: 'ASC',
  },
) =>
  request<GetCategoryResult>('get', '/public/categories/search', {}, { baseURL: import.meta.env.VITE_API_URL, params });
