import { DatePicker as D, DatePickerProps } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import { FilterDropdownProps } from 'antd/lib/table/interface';
import { FC } from 'react';

interface Props extends FilterDropdownProps {}
const DatePicker = D as any;
const FilterDateDropdown: FC<Props> = ({ confirm, selectedKeys, setSelectedKeys }) => {
  const onChange = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
    const time = value?.valueOf() as number;

    setSelectedKeys(time ? [time] : []);
    confirm();
  };

  return (
    <div>
      <DatePicker showTime onChange={onChange} defaultValue={selectedKeys[0] as any} />
    </div>
  );
};

export default FilterDateDropdown;
