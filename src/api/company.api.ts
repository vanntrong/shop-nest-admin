import { request } from '@/api/request';
import { RequestParams } from '@/interface';
import { Company, GetCompanyResult } from '@/interface/company/company.interface';

/** get Company list api */

export const apiGetCompanyList = (
  params: RequestParams = {
    offset: 1,
    limit: 10,
    sort_by: 'id',
    sort_order: 'ASC',
  },
) => request<GetCompanyResult>('get', '/public/companies', {}, { baseURL: import.meta.env.VITE_API_URL, params });

// get Company Detail
export const apiGetCompanyItem = (id: string, lang = '') =>
  request<GetCompanyResult>(
    'get',
    '/private/companies/' + id + (lang ? '?lang=' + lang : ''),
    {},
    { baseURL: import.meta.env.VITE_API_URL },
  );
// Add Company
export const apiAddCompany = (data: Company) =>
  request<GetCompanyResult>('post', '/private/companies', data, { baseURL: import.meta.env.VITE_API_URL });

// Update Company
export const apiUpdateCompany = (id: string, data: Company) =>
  request<GetCompanyResult>('put', '/private/companies/' + id, data, { baseURL: import.meta.env.VITE_API_URL });

// Delte Company
export const apiDeleteCompany = (id: string) =>
  request<GetCompanyResult>('delete', '/private/companies/' + id, {}, { baseURL: import.meta.env.VITE_API_URL });

export const apiSearchCompany = (
  params: RequestParams = {
    offset: 1,
    limit: 10,
    sort_by: 'id',
    sort_order: 'ASC',
  },
) =>
  request<GetCompanyResult>('get', '/public/companies/search', {}, { baseURL: import.meta.env.VITE_API_URL, params });

// For Combobox
export const apiGetCompanySelectBox = (
  params: RequestParams = {
    offset: 1,
    limit: 999999,
    sort_by: 'id',
    sort_order: 'ASC',
  },
) => request<GetCompanyResult>('get', '/public/companies', {}, { baseURL: import.meta.env.VITE_API_URL, params });
