import { approveOrderApi, cancelOrderApi, getDetailOrder } from '@/api/order.api';
import { OrderStatus, STATUS_COLOR, STATUS_ORDER } from '@/interface/order/order.interface';
import { numberToVND } from '@/utils/number';
import { Button, Image, Input, Modal, Space, Table, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormItem } from '../person/detail';
import { ColumnsType } from 'antd/lib/table';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>();
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');

  const getItem = async (id: string) => {
    const res: any = await getDetailOrder(id);

    setOrder(res.data);
  };

  useEffect(() => {
    if (!id) return;
    getItem(id);
  }, []);

  const renderStatusGHTK = (status: string, statusId: number) => {
    if (status === OrderStatus.PENDING)
      return (
        <Tag color="blue" className="capitalize">
          {OrderStatus.PENDING}
        </Tag>
      );
    if (status === OrderStatus.CANCELLED)
      return (
        <Tag color="red" className="capitalize">
          {OrderStatus.CANCELLED}
        </Tag>
      );

    return <Tag color={STATUS_COLOR[statusId]}>{STATUS_ORDER[statusId]}</Tag>;
  };

  const getOrderStatus = (status: string) => {
    if (status === OrderStatus.PENDING) return 'blue';
    if (status === OrderStatus.CANCELLED) return 'red';

    return 'green';
  };

  const approveOrder = async () => {
    if (!id) return;
    const res: any = await approveOrderApi(id);

    if (res) {
      message.success('Approve order successfully');
      getItem(id);
    }
  };

  const cancelOrder = async () => {
    if (!id) return;
    const res: any = await cancelOrderApi(id, { cancelReason: reason });

    if (res) {
      message.success('Cancel order successfully');
      getItem(id);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record: any) => record.product.name,
    },
    {
      title: 'Image',
      key: 'image',
      render: (_, record: any) => <Image src={record.product.thumbnailUrl} width={100} height={100} />,
    },
    {
      title: 'Price',
      key: 'price',
      render: (_, record: any) => numberToVND(record.price),
    },
    {
      title: 'Quantity',
      key: 'quantity',
      render: (_, record: any) => record.quantity,
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record: any) => numberToVND(record.price * record.quantity),
    },
  ];

  return (
    <div className="p-3 bg-white">
      <FormItem label="Name">
        <Input value={order?.name} disabled />
      </FormItem>
      <FormItem label="Email">
        <Input value={order?.email} disabled />
      </FormItem>
      <FormItem label="Phone">
        <Input value={order?.phone} disabled />
      </FormItem>
      <FormItem label="Fee ship">
        <Input value={order?.feeShip === 0 ? 'Free' : order?.feeShip} disabled />
      </FormItem>
      <FormItem label="Point earned">
        <Input value={order?.pointEarned} disabled />
      </FormItem>
      <FormItem label="Value">
        <Input value={numberToVND(order?.value)} disabled />
      </FormItem>
      <FormItem label="Actual Value">
        <Input value={numberToVND(order?.actualValue)} disabled />
      </FormItem>
      {order?.note && (
        <FormItem label="Note">
          <Input.TextArea value={order?.note} disabled />
        </FormItem>
      )}

      <FormItem label="Status">
        <Tag color={getOrderStatus(order?.status)}>{order?.status}</Tag>
      </FormItem>

      {order?.cancelReason && (
        <FormItem label="Cancel reason">
          <Input value={order?.cancelReason} disabled />
        </FormItem>
      )}
      <FormItem label="Status GHTK">{renderStatusGHTK(order?.statusGHTK, order?.statusId)}</FormItem>

      <FormItem label="Products">
        <Table columns={columns} dataSource={order?.orderProducts} pagination={false} />
      </FormItem>

      <div className="ml-auto w-fit">
        <Space>
          <Button disabled={order?.status !== OrderStatus.PENDING} onClick={() => setIsShowModal(true)}>
            Denied
          </Button>
          <Button type="primary" disabled={order?.status !== OrderStatus.PENDING} onClick={approveOrder}>
            Approve
          </Button>
        </Space>
      </div>

      <Modal
        visible={isShowModal}
        onCancel={() => setIsShowModal(false)}
        closable={false}
        onOk={() => {
          cancelOrder();
          setIsShowModal(false);
        }}
      >
        <FormItem label="Reason">
          <Input.TextArea value={reason} onChange={e => setReason(e.target.value)} />
        </FormItem>
      </Modal>
    </div>
  );
};

export default OrderDetail;
