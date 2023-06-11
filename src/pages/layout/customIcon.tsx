import { FC } from 'react';
import { ReactComponent as GuideSvg } from '@/assets/menu/guide.svg';
import { ReactComponent as PermissionSvg } from '@/assets/menu/permission.svg';
import { ReactComponent as DashboardSvg } from '@/assets/menu/dashboard.svg';
import { ReactComponent as AccountSvg } from '@/assets/menu/account.svg';
import { ReactComponent as DocumentationSvg } from '@/assets/menu/documentation.svg';
import {
  TableOutlined,
  SnippetsOutlined,
  DiffOutlined,
  DollarCircleOutlined,
  BankOutlined,
  ScheduleOutlined,
  UserOutlined,
  GlobalOutlined,
} from '@ant-design/icons';

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
    case 'content':
      com = <DiffOutlined />;

      break;
    case 'account':
      com = <AccountSvg />;

      break;
    case 'documentation':
      com = <DocumentationSvg />;

      break;
    case 'product':
      com = <TableOutlined />;

      break;
    case 'category':
      com = <SnippetsOutlined />;

      break;
    case 'coin':
      com = <DollarCircleOutlined />;

      break;
    case 'company':
      com = <BankOutlined />;

      break;
    case 'event':
      com = <ScheduleOutlined />;

      break;

    case 'person':
      com = <UserOutlined />;

      break;
    case 'country':
      com = <GlobalOutlined />;

      break;
  }

  return <span className="anticon">{com}</span>;
};
