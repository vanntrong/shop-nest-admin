import { MenuList } from '@/interface/layout/menu.interface';
import { mock, intercepter } from '../config';

const mockMenuList: MenuList = [
  {
    code: 'dashboard',
    label: {
      vi_VN: 'Dashboard',
      en_US: 'Dashboard',
    },
    icon: 'dashboard',
    path: '/dashboard',
  },
  {
    code: 'User',
    label: {
      vi_VN: 'Nguời dùng',
      en_US: 'User',
    },
    icon: 'person',
    path: '/users',
  },
  {
    code: 'category',
    label: {
      vi_VN: 'Thể loại',
      en_US: 'Category',
    },
    icon: 'category',
    path: '/categories',
  },
  {
    code: 'Product',
    label: {
      vi_VN: 'Sản phẩm',
      en_US: 'Products',
    },
    icon: 'product',
    path: '/products',
  },
  {
    code: 'Order',
    label: {
      vi_VN: 'Đơn hàng',
      en_US: 'Orders',
    },
    icon: 'order',
    path: '/orders',
  },
  {
    code: 'Promotion',
    label: {
      vi_VN: 'Mã giảm giá',
      en_US: 'Promotions',
    },
    icon: 'promotion',
    path: '/promotions',
  },
];

mock.mock('/user/menu', 'get', intercepter(mockMenuList));
