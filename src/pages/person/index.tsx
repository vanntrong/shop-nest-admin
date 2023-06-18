import ImagePreview from '@/components/wikiblock/image-preview';
import { WikiTable } from '@/components/wikiblock/table';
import { Person } from '@/interface/person/person.interface';
import { useLocale } from '@/locales';
import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
export const PersonPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const columns: ColumnsType<Person> = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: avatar => <ImagePreview src={avatar} alt={''} text={''} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Point',
      dataIndex: 'point',
      key: 'point',
    },
  ];
  const addPerson = () => {
    const path = `/users/add`;

    return navigate(path);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }} className="float-right">
        <Button
          type="primary"
          onClick={() => {
            addPerson();
          }}
        >
          {formatMessage({ id: 'app.person.list.add_person' })}
        </Button>
      </div>
      <WikiTable name="users" columns={columns} api="users" />
    </div>
  );
};
