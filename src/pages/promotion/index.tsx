import { WikiTable } from '@/components/wikiblock/table';
import { Order } from '@/interface/order/order.interface';
import { useLocale } from '@/locales';
import { numberToVND } from '@/utils/number';
import { Button, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export const PromotionPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();

  const addPromotion = () => {
    navigate('/promotions/add');
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Type Promotion',
      key: 'typePromotion',
      dataIndex: 'typePromotion',
    },
    {
      title: 'Discount For',
      key: 'discountFor',
      dataIndex: 'discountFor',
    },
    {
      title: 'Value',
      key: 'value',
      dataIndex: 'value',
      render: (value: number, record: any) => {
        if (record.discountFor === 'shipping') return 'Free Shipping';
        if (record.typePromotion === 'percent') return `${value}%`;

        return numberToVND(value);
      },
    },
    {
      title: 'Max Value',
      key: 'maxValue',
      dataIndex: 'maxValue',
      render: (value: number, record: any) => {
        if (record.discountFor === 'shipping' || !value) return '-';

        return numberToVND(value);
      },
    },
    {
      title: 'Use Times',
      key: 'usedTimes',
      dataIndex: 'usedTimes',
    },
    {
      title: 'Max Use Times',
      key: 'maxUsedTimes',
      dataIndex: 'maxUsedTimes',
    },

    {
      title: 'Expired Date',
      key: 'expiredAt',
      dataIndex: 'expiredAt',
      render(value?: string) {
        return value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : '-';
      },
    },
    {
      title: 'Created By',
      key: 'createdBy',
      dataIndex: 'createdBy',
      render(createdBy: any) {
        return createdBy ? createdBy.name : '-';
      },
    },
    {
      title: 'Active',
      key: 'isActive',
      dataIndex: 'isActive',
      render(isActive: boolean) {
        return <Tag color={isActive ? '#87d068' : '#f50'}>{isActive ? 'True' : 'False'}</Tag>;
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }} className="float-right">
        <Button
          type="primary"
          onClick={() => {
            addPromotion();
          }}
        >
          {formatMessage({ id: 'app.promotion.list.add_promotion' })}
        </Button>
      </div>
      <WikiTable name="promotions" columns={columns} api="promotions" />
    </div>
  );
};
