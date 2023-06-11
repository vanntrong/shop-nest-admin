import { Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FC } from 'react';
import { Category } from '@/interface/category/category.interface';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '@/locales';
import { WikiTable } from '@/components/wikiblock/table';
import { CATEGORY_TYPE } from '@/interface';
import { capitalize } from 'lodash';

export const CategoryPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const columns: ColumnsType<Category> = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   render: rowId => (
    //     <a title={rowId} href={'Category/' + rowId}>
    //       {rowId.length > 15 ? rowId.substring(1, 15) + '...' : rowId}
    //     </a>
    //   ),
    // },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      sorter: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filtered: true,
      render: type => capitalize(type.replace(/_/g, ' ')),
      filters: Object.keys(CATEGORY_TYPE).map((key: string) => ({
        text: key.replace(/_/g, ' '),
        value: CATEGORY_TYPE[key as keyof typeof CATEGORY_TYPE],
      })),
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      sorter: true,
      ellipsis: true,
    },
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
    },
  ];
  const addCategory = () => {
    const path = `/category/add`;

    return navigate(path);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }} className="float-right">
        <Button
          type="primary"
          onClick={() => {
            addCategory();
          }}
        >
          {formatMessage({ id: 'app.category.list.add_category' })}
        </Button>
      </div>
      <WikiTable name="category" columns={columns} api="categories" />
    </div>
  );
};
