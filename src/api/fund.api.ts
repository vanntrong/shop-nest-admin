import { Fund } from '@/interface/fund/fund.interface';
import { request } from './request';

export const apiGetFundItem = (id: string, lang = '') => {
  return request<Fund>(
    'get',
    `/private/funds/${id}${lang.length > 0 ? '?lang=' + lang : ''}`,
    {},
    { baseURL: import.meta.env.VITE_API_URL },
  );
};

export const apiUpdateFundItem = (id: string, data: Fund) => {
  return request<Fund>('put', `/private/funds/${id}`, data, { baseURL: import.meta.env.VITE_API_URL });
};

export const apiAddFundItem = (data: Fund) => {
  return request<Fund>('post', '/private/funds', data, { baseURL: import.meta.env.VITE_API_URL });
};
