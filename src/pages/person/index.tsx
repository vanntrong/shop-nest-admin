import { Button, Tag } from 'antd';
import { FC } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '@/locales';
import { WikiTable } from '@/components/wikiblock/table';
import { Person } from '@/interface/person/person.interface';
import ImagePreview from '@/components/wikiblock/image-preview';
import { Category } from '@/interface/category/category.interface';
export const PersonPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const columns: ColumnsType<Person> = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar, { name }) => <ImagePreview src={avatar} alt={name} text={name} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      render: categories => categories.map(({ id, name, title }: Category) => <Tag key={id}>{name || title}</Tag>),
    },
  ];
  const addPerson = () => {
    const path = `/person/add`;

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
      <WikiTable name="person" columns={columns} api="persons" />
    </div>
  );
};
