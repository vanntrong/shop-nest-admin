import { FC } from 'react';
import { Switch } from 'antd';

interface Props {
  children: React.ReactNode;
}
const BaseSwitch: FC<Props> = ({ children: _, ...props }) => {
  return <Switch {...props} />;
};

const MySwitch = Object.assign(Switch, BaseSwitch);

export default MySwitch;
