import { request } from './request';

export const getDetailOrder = (id: string) =>
  request('get', `/orders/${id}`, {}, { baseURL: import.meta.env.VITE_API_URL });

export const approveOrderApi = (id: string) =>
  request('patch', `/orders/${id}/approve`, {}, { baseURL: import.meta.env.VITE_API_URL });

export const cancelOrderApi = (id: string, { cancelReason }: any) =>
  request('patch', `/orders/${id}/cancel`, { cancelReason }, { baseURL: import.meta.env.VITE_API_URL });
