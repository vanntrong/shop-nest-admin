import { ReactComponent as DashboardSvg } from '@/assets/menu/dashboard.svg';
import { ReactComponent as GuideSvg } from '@/assets/menu/guide.svg';
import { ReactComponent as PermissionSvg } from '@/assets/menu/permission.svg';
import {
  PropertySafetyOutlined,
  ShoppingCartOutlined,
  SnippetsOutlined,
  TableOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { FC } from 'react';

interface CustomIconProps {
  type: string;
}

export const CustomIcon: FC<CustomIconProps> = props => {
  const { type } = props;
  let com = <GuideSvg />;

  switch (type) {
    case 'guide':
      com = <GuideSvg />;

      break;
    case 'permission':
      com = <PermissionSvg />;

      break;
    case 'dashboard':
      com = <DashboardSvg />;

      break;

    case 'product':
      com = <TableOutlined />;

      break;
    case 'category':
      com = <SnippetsOutlined />;

      break;

    case 'person':
      com = <UserOutlined />;

      break;
    case 'order':
      com = <ShoppingCartOutlined />;

      break;
    case 'promotion':
      com = <PropertySafetyOutlined />;

      break;

      break;
  }

  return <span className="anticon">{com}</span>;
};
