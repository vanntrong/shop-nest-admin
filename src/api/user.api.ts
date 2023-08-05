import { LoginParams, LoginResult, LogoutResult } from '@/interface/user/login';
import { request } from './request';
import axios, { AxiosResponse } from 'axios';

/** 登录接口 */
export const apiLogin = (data: LoginParams) =>
  request<LoginResult>('post', '/auth/login', data, { baseURL: import.meta.env.VITE_API_URL });

/** 登出接口 */
export const apiLogout = () =>
  request<LogoutResult>('post', '/auth/logout', {}, { baseURL: import.meta.env.VITE_API_URL });

// import { API_URL } from '@/configs/app.config';

export type TRefreshTokenResponse = {
  tokens: {
    access_token: string;
    refresh_token: string;
    exp: number;
  };
};

export const refreshToken = async (refreshToken: string): Promise<AxiosResponse<TRefreshTokenResponse>> => {
  return axios.post(`/auth/refresh-token`, undefined, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
    baseURL: import.meta.env.VITE_API_URL,
  });
};
