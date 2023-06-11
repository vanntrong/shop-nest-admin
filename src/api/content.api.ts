import { ContentDraftParams, ContentStatus } from '@/interface/content/content.interface';
import { request } from './request';

export const apiGetContentItem = (id: string, lang: string | null) =>
  request<any>('get', `/private/news/${id}`, {}, { baseURL: import.meta.env.VITE_API_URL, params: { lang } });

export const apiGetDraftContent = (
  params: ContentDraftParams = {
    page: 1,
    perPage: 10,
    status: ContentStatus.PUBLISHED,
    q: '',
  },
) => request<any>('get', `/content/web`, {}, { baseURL: import.meta.env.VITE_API_LISTENING_API_URL, params });

export const apiGetDraftContentItem = (id: string) =>
  request<any>('get', `/content/${id}/web`, {}, { baseURL: import.meta.env.VITE_API_LISTENING_API_URL });

export const searchCategories = (id: string, lang: string | null) =>
  request<any>('get', `/private/news/${id}`, {}, { baseURL: import.meta.env.VITE_API_URL, params: { lang } });

export const apiUpdateContentItem = (id: string, data: any) =>
  request<any>('put', '/private/news/' + id, data, { baseURL: import.meta.env.VITE_API_URL });

export const apiCreateContentItem = (data: any) =>
  request<any>('post', '/private/news/', data, { baseURL: import.meta.env.VITE_API_URL });

export const apiChangeStatusContentItem = (id: string, status: string) =>
  request<any>(
    'patch',
    '/public/news/status/' + id + `?status=${status}`,
    {},
    { baseURL: import.meta.env.VITE_API_URL },
  );
