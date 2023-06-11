import 'antd/dist/antd.css';
import { isEmpty, omitBy } from 'lodash';
import { FC, useEffect, useState } from 'react';
import ContentAdd from '../../components/content/add';
import { message } from 'antd';
import { apiCreateContentItem, apiGetDraftContentItem } from '@/api/content.api';
import { useParams } from 'react-router-dom';
import { Content, ContentStatus } from '@/interface/content/content.interface';
import { uploadImages } from '@/utils/helper';

export const ContentAddPage: FC = () => {
  const { id } = useParams();
  const [newsContent, setNewsContent] = useState<Content>();

  const create = async (data: any) => {
    const result: any = await apiCreateContentItem(omitBy(data, isEmpty));

    if (!result) return;
    message.success('Create success');
  };

  const onFinish = async (values: any) => {
    if (values.photos.length > 0) {
      message.loading({ content: 'Upload images...', key: 'loading' });

      values.photos = await uploadImages(values.photos, 'news');

      message.success({ content: 'Upload images success', key: 'loading' });
    }

    create(values);
  };

  const fetchContentDraft = async (id: string) => {
    const {
      data: {
        body: content,
        createdAt: created_at,
        description: summary = '',
        status = ContentStatus.DRAFT,
        title = '',
        languageCode = 'en',
      },
    } = (await apiGetDraftContentItem(id)) as any;

    setNewsContent({
      content,
      created_at,
      languageCode,
      summary,
      title,
      status,
    });
  };

  useEffect(() => {
    if (id) fetchContentDraft(id);
  }, [id]);

  return <>{newsContent && <ContentAdd onFinish={onFinish} isEdit newsData={newsContent} />}</>;
};
