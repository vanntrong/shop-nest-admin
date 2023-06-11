import { RequestParams } from '@/interface';
import { GetPersonResult, Person } from '@/interface/person/person.interface';
import { request } from './request';

export const apiSearchPerson = (
  params: RequestParams = {
    offset: 1,
    limit: 10,
    sort_by: 'id',
    sort_order: 'ASC',
  },
) => request<GetPersonResult>('get', '/public/persons/search', {}, { baseURL: import.meta.env.VITE_API_URL, params });

export const apiGetPersonList = (
  params: RequestParams = {
    offset: 1,
    limit: 10,
  },
) => request<GetPersonResult>('get', '/public/persons', {}, { baseURL: import.meta.env.VITE_API_URL, params });

// get Person Detail
export const apiGetPersonItem = (id: string, lang = '') =>
  request<GetPersonResult>(
    'get',
    '/private/persons/' + id + (lang ? '?lang=' + lang : ''),
    {},
    { baseURL: import.meta.env.VITE_API_URL },
  );
// Add Person
export const apiAddPerson = (data: Person) =>
  request<GetPersonResult>('post', '/private/persons', data, { baseURL: import.meta.env.VITE_API_URL });

// Update Person
export const apiUpdatePerson = (id: string, data: Person) =>
  request<GetPersonResult>('put', '/private/persons/' + id, data, { baseURL: import.meta.env.VITE_API_URL });

// Delte Person
export const apiDeletePerson = (id: string) =>
  request<GetPersonResult>('delete', '/private/persons/' + id, {}, { baseURL: import.meta.env.VITE_API_URL });
