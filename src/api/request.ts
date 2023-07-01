import axios, { AxiosRequestConfig } from 'axios';
import { message as $message } from 'antd';
import store from '@/stores';

const axiosInstance = axios.create({
  timeout: 6000,
});

axiosInstance.interceptors.request.use(
  config => {
    // store.dispatch(
    //   setGlobalState({
    //     loading: true,
    //   }),
    // );

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
    // store.dispatch(
    //   setGlobalState({
    //     loading: false,
    //   }),
    // );
    if (config?.data?.message) {
      switch (config.config.method) {
        case 'delete':
          break;
        case 'put':
          //$message.info(formatMessage({ id: 'global.tips.deleteSuccess' }).replace('{0}', 'id'));
          break;
        case 'post':
      }
      // $message.success(config.data.message)
    }

    return config?.data;
  },
  error => {
    // store.dispatch(
    //   setGlobalState({
    //     loading: false,
    //   }),
    // );
    let errMsg = 'Error';

    if (error.response && error.response.data) {
      const { message = ['Error'] } = error.response.data;

      errMsg = message[0];
    }

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

/**
 *
 * @param method - request methods
 * @param url - request url
 * @param data - request data or params
 */
export const request = <T = any>(
  method: Method,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): MyResponse<T> => {
  // const prefix = '/api'
  const prefix = '';

  url = prefix + url;
  const _config = config as AxiosRequestConfig;
  const token = store.getState().user.accessToken;

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
