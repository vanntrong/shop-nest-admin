import { WikiTable } from '@/components/wikiblock/table';
import { Order, OrderStatus } from '@/interface/order/order.interface';
import { numberToVND } from '@/utils/number';
import { Badge, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FC } from 'react';
import { Link } from 'react-router-dom';

export const OrderPage: FC = () => {
  const columns: ColumnsType<Order> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      render: (id: number, record: Order) => {
        if (record.status === OrderStatus.PENDING) {
          return (
            <Badge.Ribbon text="Pending" placement="end">
              <Link to={`/orders/${id}`}>{id}</Link>;
            </Badge.Ribbon>
          );
        }

        return <Link to={`/orders/${id}`}>{id}</Link>;
      },
    },
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
      key: 'status',
      dataIndex: 'status',
      render(value: number, record: Order) {
        if (record.status === OrderStatus.PENDING)
          return (
            <Tag color="blue" className="capitalize">
              {record.statusDetail}
            </Tag>
          );
        if (record.status === OrderStatus.CANCELLED)
          return (
            <Tag color="red" className="capitalize">
              {record.statusDetail}
            </Tag>
          );

        return <Tag color={'#26aa99'}>{record.statusDetail}</Tag>;
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
