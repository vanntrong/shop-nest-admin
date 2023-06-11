import { apiCreateContentItem, apiGetContentItem, apiUpdateContentItem } from '@/api/content.api';
import { Content } from '@/interface/content/content.interface';
import 'antd/dist/antd.css';
import { isEmpty, omitBy } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContentAdd from '../../components/content/add';
// import { useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import { uploadImages } from '@/utils/helper';

export const ContentDetailPage: FC = () => {
  const { id } = useParams();
  // const [searchParams] = useSearchParams();

  const [newsDetail, setNewsDetail] = useState<Content | null>(null);

  const fetch = async (id: string, lang: string | null) => {
    const result: any = await apiGetContentItem(id, lang);

    if (!result) return;
    setNewsDetail(result);
  };

  const update = async (id: string, data: any) => {
    if (data.photos.length > 0) {
      message.loading({ content: 'Upload images...', key: 'loading' });

      data.photos = await uploadImages(data.photos, 'news');

      message.success({ content: 'Upload images success', key: 'loading' });
    }

    const result: any = await apiUpdateContentItem(id, omitBy(data, isEmpty));

    if (!result) return;
    setNewsDetail(result);
    message.success('Update success');
  };

  const create = async (data: any) => {
    console.log({ data });
    const result: any = await apiCreateContentItem(omitBy(data, isEmpty));

    if (!result) return;
    setNewsDetail(result);
    message.success('Create success');
  };

  useEffect(() => {
    // const languageParams = searchParams.get('language');

    if (!id) return;

    fetch(id, null);
  }, [id]);

  const onFinish = (values: any) => {
    if (id) {
      update(id, values);
    } else {
      create(values);
    }
  };

  return newsDetail && <ContentAdd newsData={newsDetail} onFinish={onFinish} isEdit />;
};
