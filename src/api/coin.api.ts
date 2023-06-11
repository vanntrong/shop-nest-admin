import { request } from '@/api/request';
import { RequestParams } from '@/interface';
import { Coin, GetBlockchainResul, GetCoinResult } from '@/interface/coin/coin.interface';

/** get Coin list api */

export const apiGetCoinList = (
  params: RequestParams = {
    offset: 1,
    limit: 10,
    sort_by: 'id',
    sort_order: 'ASC',
  },
) => request<GetCoinResult>('get', '/public/assets', {}, { baseURL: import.meta.env.VITE_API_URL, params });

// get Coin Detail
export const apiGetCoinItem = (id: string, lang = '') =>
  request<GetCoinResult>(
    'get',
    '/private/assets/' + id + (lang ? '?lang=' + lang : ''),
    {},
    { baseURL: import.meta.env.VITE_API_URL },
  );

// Add Coin
export const apiAddCoin = (data: Coin) =>
  request<GetCoinResult>('post', '/private/assets', data, { baseURL: import.meta.env.VITE_API_URL });

// Update Coin
export const apiUpdateCoin = (id: string, data: Coin) =>
  request<GetCoinResult>('put', '/private/assets/' + id, data, { baseURL: import.meta.env.VITE_API_URL });

// Delte Coin
export const apiDeleteCoin = (id: string) =>
  request<GetCoinResult>('delete', '/private/assets/' + id, {}, { baseURL: import.meta.env.VITE_API_URL });

export const apiSearchCoin = (
  params: RequestParams = {
    offset: 1,
    limit: 10,
    sort_by: 'created_at',
    sort_order: 'ASC',
  },
) => request<GetCoinResult>('get', '/public/assets/search', {}, { baseURL: import.meta.env.VITE_API_URL, params });

// For Combobox
export const apiGetBlockchainSelectBox = (
  params: RequestParams = {
    offset: 1,
    limit: 999999,
    sort_by: 'created_at',
    sort_order: 'ASC',
  },
) => request<GetBlockchainResul>('get', '/public/blockchains', {}, { baseURL: import.meta.env.VITE_API_URL, params });
