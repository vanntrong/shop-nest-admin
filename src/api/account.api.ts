import { UpdateMePayload } from '@/interface/account/account.interface';
import { User } from '@/interface/user/user';
import { request } from './request';

export const getMeApi = () => request('get', '/users/me', null, { baseURL: import.meta.env.VITE_API_URL });

export const updateMeApi = (data: UpdateMePayload) =>
  request<User>('put', '/users/me', data, { baseURL: import.meta.env.VITE_API_URL });
