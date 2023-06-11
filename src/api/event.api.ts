import { request } from '@/api/request';
import { RequestParams } from '@/interface';
import { Event, GetEventResult } from '@/interface/event.interface';
/** get Event list api */

export const apiEventList = (
  params: RequestParams = {
    offset: 1,
    limit: 10,
  },
) => request<GetEventResult>('get', '/public/events', {}, { baseURL: import.meta.env.VITE_API_URL, params });

// get Event Detail
export const apiGetEventItem = (id: string, lang?: string) =>
  request<GetEventResult>(
    'get',
    '/private/events/' + id + (lang ? '?lang=' + lang : ''),
    {},
    { baseURL: import.meta.env.VITE_API_URL },
  );
// Add Event
export const apiAddEvent = (data: Partial<Event>) =>
  request<GetEventResult>('post', '/private/events', data, { baseURL: import.meta.env.VITE_API_URL });

// Update Event
export const apiUpdateEvent = (id: string, data: Partial<Event>) =>
  request<GetEventResult>('put', '/private/events/' + id, data, { baseURL: import.meta.env.VITE_API_URL });

// Delte Event
export const apiDeleteEvent = (id: string) =>
  request<GetEventResult>('delete', '/private/events/' + id, {}, { baseURL: import.meta.env.VITE_API_URL });

export const apiSearchEvent = (
  params: RequestParams = {
    offset: 1,
    limit: 10,
  },
) => request<GetEventResult>('get', '/public/events/search', {}, { baseURL: import.meta.env.VITE_API_URL, params });

export const apiUpdateTrendingEvent = (id: string, data: object) =>
  request<GetEventResult>('patch', '/public/events/' + id + '/trending', data, {
    baseURL: import.meta.env.VITE_API_URL,
  });

export const apiUpdateSignificantEvent = (id: string, data: object) =>
  request<GetEventResult>('patch', '/public/events/' + id + '/significant', data, {
    baseURL: import.meta.env.VITE_API_URL,
  });
