import { WikiTable } from '@/components/wikiblock/table';
import { Order, STATUS_COLOR, STATUS_ORDER } from '@/interface/order/order.interface';
import { numberToVND } from '@/utils/number';
import { Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FC } from 'react';

export const OrderPage: FC = () => {
  const columns: ColumnsType<Order> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Number of products',
      key: 'numberOfProducts',
      render: (_, record: Order) => record.orderProducts.length,
    },
    {
      title: 'Fee Ship',
      key: 'feeShip',
      dataIndex: 'feeShip',
      sorter: true,
      render: (feeShip: number) => numberToVND(feeShip),
    },
    {
      title: 'Total Price',
      key: 'value',
      dataIndex: 'value',
      render: (value: number) => numberToVND(value),
      sorter: true,
    },
    {
      title: 'Actual Price',
      key: 'actualValue',
      dataIndex: 'actualValue',
      render: (actualValue: number) => numberToVND(actualValue),
      sorter: true,
    },
    {
      title: 'Point Earned',
      key: 'pointEarned',
      dataIndex: 'pointEarned',
      sorter: true,
      render(value: number) {
        return `${value ?? 0} points`;
      },
    },
    {
      title: 'Point Used',
      key: 'pointUsed',
      dataIndex: 'pointUsed',
      sorter: true,
      render(value: number) {
        return `${value ?? 0} points`;
      },
    },
    {
      title: 'Promotion Used',
      key: 'promotionUsed',
      dataIndex: 'promotionUsed',
      render(promotionUsed: any) {
        return promotionUsed ? promotionUsed.code : '-';
      },
    },
    {
      title: 'Address',
      key: 'address',
      render(_, record: Order) {
        return `${record.address}, ${record.district}, ${record.ward}, ${record.province}`;
      },
    },
    {
      title: 'Status',
      key: 'statusId',
      dataIndex: 'statusId',
      render(value: number) {
        return <Tag color={STATUS_COLOR[value]}>{STATUS_ORDER[value]}</Tag>;
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }} className="float-right"></div>
      <WikiTable name="orders" columns={columns} api="orders" hideActions />
    </div>
  );
};
