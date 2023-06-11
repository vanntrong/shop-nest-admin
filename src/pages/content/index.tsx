import { WikiTable } from '@/components/wikiblock/table';
import { Content } from '@/interface/content/content.interface';
import { useLocale } from '@/locales';
import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export const ContentPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const columns: ColumnsType<Content> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '40%',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render(value) {
        return <div className="p-[5px] rounded bg-[#34a0a4] w-fit text-[#c7f9cc] capitalize">{value}</div>;
      },
    },
    {
      title: 'Published At',
      dataIndex: 'published_at',
      key: 'published_at',
      render(value) {
        return value ? dayjs(value).format('DD MMM YYYY') : 'NAN';
      },
    },
  ];
  const addContent = () => {
    const path = `/content/draft`;

    return navigate(path);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }} className="float-right">
        <Button type="primary" onClick={addContent}>
          {formatMessage({ id: 'app.content.list.add_content' })}
        </Button>
      </div>
      <WikiTable name="content" columns={columns} api="news" />
    </div>
  );
};
