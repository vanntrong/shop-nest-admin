import { request } from '@/api/request';
import { isEmpty, isNull, isUndefined, omit, omitBy } from 'lodash';

export const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = error => reject(error);
  });

export const uploadImages = async (imageURLs: string[], folder = 'wikiblock') => {
  const formattedImages = await Promise.all(
    imageURLs.map(async imageURL => {
      let picture = '';
      let imgData: any = imageURL;

      if (!imageURL.startsWith('http')) {
        imgData = new FormData();
        const blob = await fetch(imageURL).then(res => res.blob());

        imgData.append('file', blob, 'test.png');
        imgData.append('folder', folder);

        const res: any = await request('post', '/public/upload/images', imgData, {
          baseURL: import.meta.env.VITE_API_UPLOAD_IMAGE_URL,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        picture = res?.url;
      } else {
        picture = imageURL;
      }

      return picture;
    }),
  );

  return formattedImages;
};

export function shortedName(name: string) {
  const names = name.trim().split(' ');
  const firstNames = names[0].split('');
  const lastNames = names[names.length - 1].split('');

  return `${firstNames[0]}${lastNames[0]}`.toUpperCase();
}

/**
 *
 * @param obj
 * @returns obj after remove null, undefined, empty string
 */
export const formatDataPayload = (obj: any) => {
  const _obj = omitBy(obj, (value: any) => {
    return isNull(value) || isUndefined(value) || value === '';
  });

  Object.keys(_obj).forEach(key => {
    if (Array.isArray(_obj[key])) {
      _obj[key] = _obj[key].filter((item: any) => !isEmpty(item) && !isNull(item) && !isUndefined(item));
    }
  });

  return _obj;
};

/**
 *
 * @param obj
 * @param key
 * @returns obj after format field trans
 */
export const formatTrans = (obj: any, key: string | string[]): any => {
  const { trans, ...rest } = obj;

  if (!Array.isArray(key)) {
    const keyValueLangDifferentEn = rest[key]?.map((item: any) => omit(item, 'en'));

    if (!keyValueLangDifferentEn) {
      return obj;
    }

    const transUpdated = trans.map((tran: any) => {
      const { lang, ...restTran } = tran;

      const keyWithLang = keyValueLangDifferentEn.filter((item: any) => Object.keys(item)[0] === lang);

      return {
        ...restTran,
        lang,
        [key]: keyWithLang.map((key: any) => Object.values(key)[0]),
      };
    });

    rest[key] = rest[key]?.map((item: any) => item.en);

    return {
      ...rest,
      trans: transUpdated,
    };
  }

  return key.map((item: string) => formatTrans(obj, item));
};

const language: { [key: string]: string } = {
  en: 'English',
  vi: 'Vietnamese',
};

export const formatLanguage = (code: string) => {
  return language[code];
};

export const getFileSize = (size: number) => {
  return Math.floor(size / 1024 / 1024);
};
