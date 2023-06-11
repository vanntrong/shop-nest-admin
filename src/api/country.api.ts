import { request } from '@/api/request';
import { RequestParams } from '@/interface';
import { Country, GetCountryResult } from '@/interface/country/country.interface';

/** get Country list api */

export const apiGetCountryList = (
  params: RequestParams = {
    offset: 1,
    limit: 10,
    sort_by: 'id',
    sort_order: 'ASC',
  },
) => request<GetCountryResult>('get', '/public/countries', {}, { baseURL: import.meta.env.VITE_API_URL, params });

// get Country Detail
export const apiGetCountryItem = (id: string) =>
  request<GetCountryResult>('get', '/private/countries/' + id, {}, { baseURL: import.meta.env.VITE_API_URL });
// Add Country
export const apiAddCountry = (data: Country) =>
  request<GetCountryResult>('post', '/private/countries', data, { baseURL: import.meta.env.VITE_API_URL });

// Update Country
export const apiUpdateCountry = (id: string, data: Country) =>
  request<GetCountryResult>('put', '/private/Countries/' + id, data, { baseURL: import.meta.env.VITE_API_URL });

// Delte Country
export const apiDeleteCountry = (id: string) =>
  request<GetCountryResult>('delete', '/private/Countries/' + id, {}, { baseURL: import.meta.env.VITE_API_URL });
