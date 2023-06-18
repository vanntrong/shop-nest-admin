import { request } from './request';

// get Promotion Detail
export const apiGetPromotionItem = (id: string) =>
  request<any>('get', '/promotions/' + id, {}, { baseURL: import.meta.env.VITE_API_URL });

// Update Promotion
export const apiUpdatePromotion = (id: string, data: any) =>
  request<any>('put', '/promotions/' + id, data, { baseURL: import.meta.env.VITE_API_URL });

// Add Promotion
export const apiAddPromotion = (data: any) =>
  request<any>('post', '/promotions', data, { baseURL: import.meta.env.VITE_API_URL });
