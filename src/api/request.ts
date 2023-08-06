import store from '@/stores';
import { setToken } from '@/stores/user.store';
import { clearCookies, getToken } from '@/utils/cookies';
import { message as $message } from 'antd';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { TRefreshTokenResponse, refreshToken } from './user.api';

const axiosInstance = axios.create({
  timeout: 6000,
});

axiosInstance.interceptors.request.use(
  async config => {
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  config => {
    const token = store.getState().user.accessToken;

    axiosInstance.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';

    if (config?.data?.message) {
      switch (config.config.method) {
        case 'delete':
          break;
        case 'put':
          break;
        case 'post':
      }
    }

    return config?.data;
  },
  error => {
    let errMsg = 'Error';

    if (error.response && error.response.data) {
      const { message = ['Error'] } = error.response.data;

      errMsg = message[0];
    }

    console.log(error);

    $message.error(errMsg);

    throw new Error(errMsg);
  },
);

export type Response<T = any> = {
  status: boolean;
  message: string;
  result: T;
};

type Method = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type MyResponse<T = any> = Promise<Response<T>>;

const handleRefreshToken = (token: string) => {
  return refreshToken(token);
};

let refreshHandler: Promise<AxiosResponse<TRefreshTokenResponse>> | null = null;

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request = async <T = any>(
  method: Method,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): MyResponse<T> => {
  const prefix = '';

  url = prefix + url;
  const _config = config as AxiosRequestConfig;
  let token: string | undefined = getToken('access_token');

  const rfToken = getToken('refresh_token');

  const isTokenExpired = token === undefined && rfToken !== undefined;

  if (isTokenExpired && rfToken) {
    try {
      refreshHandler = refreshHandler ? refreshHandler : handleRefreshToken(rfToken);

      const response = await refreshHandler;

      refreshHandler = null;
      if (response) {
        store.dispatch(
          setToken({
            refreshToken: response.data.tokens.refresh_token,
            accessToken: response.data.tokens.access_token,
            exp: response.data.tokens.exp,
          }),
        );
        token = response.data.tokens.access_token;
      }
    } catch (error) {
      clearCookies();
      token = undefined;
    }
  }

  console.log('config', config);
  if (token) _config.headers = { Authorization: `Bearer ${token}` };

  switch (method) {
    case 'post':
      return axiosInstance.post(url, data, config);
    case 'put':
      return axiosInstance.put(url, data, config);
    case 'delete':
      return axiosInstance.delete(url, config);
    case 'patch':
      return axiosInstance.patch(url, data, config);
    default:
      return axiosInstance.get(url, { params: data, ...config });
  }
};
