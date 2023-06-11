import { apiGetCategorySelectBox } from '@/api/category.api';
import { WikiTable } from '@/components/wikiblock/table';
import { Category } from '@/interface/category/category.interface';
import { Product } from '@/interface/product/product.interface';
import { useLocale } from '@/locales';
import { Avatar, Button, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProductPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [isContentReady, setIsContentReady] = useState(false);

  const fetchCategory = async () => {
    const { data = [] }: any = await apiGetCategorySelectBox();

    if (data) {
      setCategories(data);
    }
    setIsContentReady(true);
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const columns: ColumnsType<Product> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="flex items-center">
          <Avatar src={record.avatar}>{name[0].toUpperCase()}</Avatar>
          <span style={{ marginLeft: 10 }} className="whitespace-nowrap">
            <a title="View & Edit" href={'/product/' + record.id}>
              {name}
            </a>
          </span>
        </div>
      ),
    },
    {
      title: 'About',
      dataIndex: 'about',
      key: 'about',
      render: (about: string) => <p className="text-ellipsis line-clamp-2">{about}</p>,
      width: 400,
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      filterSearch: true,
      filters: categories!.map((category: Category) => ({ text: category.name, value: category.id })),

      render: (categories = []) => {
        return categories.map(({ id, name, title }: Category) => <Tag key={id}>{name || title}</Tag>);
      },
      // width: 400,
    },
  ];
  const addProduct = () => {
    const path = `/product/add`;

    return navigate(path);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }} className="float-right">
        <Button
          type="primary"
          onClick={() => {
            addProduct();
          }}
        >
          {formatMessage({ id: 'app.product.list.add_product' })}
        </Button>
      </div>
      {isContentReady && <WikiTable name="product" columns={columns} api="products" />}
    </div>
  );
};
