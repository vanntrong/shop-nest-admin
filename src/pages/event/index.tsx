import { apiUpdateSignificantEvent, apiUpdateTrendingEvent } from '@/api/event.api';
import FilterDateDropdown from '@/components/wikiblock/filter/date';
import { WikiTable } from '@/components/wikiblock/table';
import { Event } from '@/interface/event.interface';
import { useLocale } from '@/locales';
import { Button, message, Switch } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
export const EventPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();

  const handleSwitchChange = async (checked: boolean, id: string, type: 'trending' | 'significant') => {
    let result: any;

    switch (type) {
      case 'trending':
        result = await apiUpdateTrendingEvent(id, { trending: checked });

        break;
      case 'significant':
        result = await apiUpdateSignificantEvent(id, { significant: checked });
      default:
        break;
    }

    if (result) {
      message.success('Update success');
    }
  };

  const columns: ColumnsType<Event> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filtered: true,
      filters: [
        {
          text: 'Online',
          value: 'online',
        },
        {
          text: 'Offline',
          value: 'offline',
        },
        {
          text: 'Virtual',
          value: 'virtual',
        },
      ],
    },

    {
      title: 'Start date',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (value: Date) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
      filtered: true,
      filterDropdown(props) {
        return <FilterDateDropdown {...props} />;
      },
    },
    {
      title: 'End date',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (value: Date) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
      filtered: true,
      filterDropdown(props) {
        return <FilterDateDropdown {...props} />;
      },
    },
    {
      title: 'Trending',
      dataIndex: 'trending',
      key: 'trending',
      render: (trending: boolean, record: Event) => (
        <Switch defaultChecked={trending} onChange={checked => handleSwitchChange(checked, record.id, 'trending')} />
      ),
    },
    {
      title: 'Significant',
      dataIndex: 'significant',
      key: 'significant',
      render: (significant: boolean, record: Event) => (
        <Switch
          defaultChecked={significant}
          onChange={checked => handleSwitchChange(checked, record.id, 'significant')}
        />
      ),
    },
  ];
  const addEvent = () => {
    const path = `/event/add`;

    return navigate(path);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }} className="float-right">
        <Button
          type="primary"
          onClick={() => {
            addEvent();
          }}
        >
          {formatMessage({ id: 'app.event.list.add_event' })}
        </Button>
      </div>
      <WikiTable name="event" columns={columns} api="events" />
    </div>
  );
};
