import { FC } from 'react';
import { DatePicker } from 'antd';

const BasePicker: FC = props => {
  const D = MyDatePicker as any;

  return <D {...props} />;
};

const MyDatePicker = Object.assign(DatePicker, BasePicker);

export default MyDatePicker;
