import { WikiTable } from '@/components/wikiblock/table';
import { Fund } from '@/interface/fund/fund.interface';
import { useLocale } from '@/locales';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FundPage = () => {
  const navigate = useNavigate();
  const { formatMessage } = useLocale();

  const columns: ColumnsType<Fund> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: avatar => <img src={avatar} alt="" className="max-w-[60px] max-h-[60px] object-cover" />,
    },
    {
      title: 'About',
      key: 'about',
      dataIndex: 'about',
      render(value = '-') {
        return <div className="whitespace-pre-line">{value}</div>;
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }} className="float-right">
        <Button
          type="primary"
          onClick={() => {
            navigate('/funds/add');
          }}
        >
          {formatMessage({ id: 'app.fund.list.add_fund' })}
        </Button>
      </div>
      <WikiTable columns={columns} name="funds" />
    </div>
  );
};

export default FundPage;
