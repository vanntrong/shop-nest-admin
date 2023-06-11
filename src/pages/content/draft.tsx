import { apiGetDraftContent } from '@/api/content.api';
import { ContentDraftParams, ContentStatus, DraftContent } from '@/interface/content/content.interface';
import { formatLanguage } from '@/utils/helper';
import { Button, Table, Tag, TableProps } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const DraftContentPage = () => {
  const [draftContent, setDraftContent] = useState<any>([]);
  const [params, setParams] = useState<ContentDraftParams>();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchItems = async (params?: ContentDraftParams) => {
    if (!params) return;

    const {
      data: { items = [] },
    } = (await apiGetDraftContent(params)) as any;

    setDraftContent(items);
  };

  const columns: ColumnsType<DraftContent> = [
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: 'Created By',
      key: 'author',
      dataIndex: 'author',
      render: ({ name }: { name: string }) => {
        return <span>{name}</span>;
      },
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: value => {
        return <Tag color={value === 'published' ? 'success' : 'magenta'}>{value}</Tag>;
      },
    },
    {
      title: 'Language',
      key: 'languageCode',
      dataIndex: 'languageCode',
      render: value => {
        return <Tag>{formatLanguage(value)}</Tag>;
      },
    },
    // {
    //   title: 'Published At',
    //   key: 'published_at',
    //   dataIndex: 'published_at',
    // },
    {
      title: 'Created At',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: value => {
        return dayjs(value).format('HH:mm DD MMM YYYY');
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render(_, { id }) {
        return (
          <div>
            <Link to={`/content/draft/${id}`}>
              <Button>Create Content</Button>
            </Link>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchItems(params);
  }, [params]);

  useEffect(() => {
    setParams({
      page: Number(searchParams.get('page')) || 1,
      perPage: Number(searchParams.get('perPage')) || 10,
      q: searchParams.get('q') || '',
      status: ContentStatus.PUBLISHED,
    });
  }, []);

  const handleTableChange: TableProps<any>['onChange'] = pagination => {
    const { current = 1, pageSize = 10 } = pagination;

    setParams(prev => ({ ...prev, page: current, perPage: pageSize }));
    setSearchParams({ page: current.toString(), perPage: pageSize.toString() });
  };

  return (
    <div>
      <Table columns={columns} dataSource={draftContent} rowKey={({ id }) => id} onChange={handleTableChange} />
    </div>
  );
};

export default DraftContentPage;
