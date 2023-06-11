import { AxiosRequestConfig } from 'axios';
import { request } from './request';

export const FileApi = {
  upload: ({
    data,
    url = import.meta.env.VITE_API_UPLOAD_IMAGE_URL + '/public/upload/images',
    config,
    method = 'post',
  }: {
    data: FormData;
    method?: 'post';
    url?: string;
    config?: AxiosRequestConfig;
  }) => request<any>(method, url, data, config),
};
