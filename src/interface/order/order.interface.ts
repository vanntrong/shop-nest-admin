export enum OrderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  CANCELLED = 'cancelled',
}
export interface Order {
  id: string;
  name: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  feeShip: number;
  value: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  orderProducts: OrderProduct[];
  status: string;
}

export interface OrderProduct {
  id: string;
  price: number;
  quantity: number;
}

export const STATUS_ORDER: Record<number, string> = {
  [-1]: 'Hủy đơn hàng',
  [1]: 'Chưa tiếp nhận',
  [2]: 'Đã tiếp nhận',
  [3]: 'Đã lấy hàng/Đã nhập kho',
  [4]: 'Đã điều phối giao hàng/Đang giao hàng',
  [5]: 'Đã giao hàng/Chưa đối soát',
  [6]: 'Đã đối soát',
  [7]: 'Không lấy được hàng',
  [8]: 'Hoãn lấy hàng',
  [9]: 'Không giao được hàng',
  [10]: 'Delay giao hàng',
  [11]: 'Đã đối soát công nợ trả hàng',
  [12]: 'Đã điều phối lấy hàng/Đang lấy hàng',
  [13]: 'Đơn hàng bồi hoàn',
  [20]: 'Đang trả hàng (COD cầm hàng đi trả)',
  [21]: 'Đã trả hàng (COD đã trả xong hàng)',
  [123]: 'Shipper báo đã lấy hàng',
  [127]: 'Shipper (nhân viên lấy/giao hàng) báo không lấy được hàng',
  [128]: 'Shipper báo delay lấy hàng',
  [45]: 'Shipper báo đã giao hàng',
  [49]: 'Shipper báo không giao được giao hàng',
  [410]: 'Shipper báo delay giao hàng',
};

export const STATUS_COLOR: Record<number, string> = {
  [-1]: 'red',
  [1]: 'blue',
  [2]: 'blue',
  [3]: 'green',
  [4]: 'green',
  [5]: 'purple',
  [6]: 'purple',
  [7]: 'gray',
  [8]: 'gray',
  [9]: 'gray',
  [10]: 'gray',
  [11]: 'purple',
  [12]: 'green',
  [13]: 'red',
  [20]: 'orange',
  [21]: 'orange',
  [123]: 'green',
  [127]: 'red',
  [128]: 'gray',
  [45]: 'green',
  [49]: 'red',
  [410]: 'orange',
};
