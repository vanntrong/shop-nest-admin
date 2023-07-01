import { LoginParams, LoginResult, LogoutResult } from '@/interface/user/login';
import { request } from './request';

/** 登录接口 */
export const apiLogin = (data: LoginParams) =>
  request<LoginResult>('post', '/auth/login', data, { baseURL: import.meta.env.VITE_API_URL });

/** 登出接口 */
export const apiLogout = () =>
  request<LogoutResult>('post', '/auth/logout', {}, { baseURL: import.meta.env.VITE_API_URL });
