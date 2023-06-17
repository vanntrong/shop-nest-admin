import { apiGetCategorySelectBox } from '@/api/category.api';
import { WikiTable } from '@/components/wikiblock/table';
import { Category } from '@/interface/category/category.interface';
import { Product } from '@/interface/product/product.interface';
import { useLocale } from '@/locales';
import { numberToVND } from '@/utils/number';
import { Button, Image, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const formatCategoriesData = (data: any) => {
  if (!data || !data.length) return [];

  return data.reduce((acc, next) => {
    const { subCategories, ...rest } = next;

    return [...acc, rest, ...formatCategoriesData(subCategories)];
  }, []);
};

export const ProductPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [isContentReady, setIsContentReady] = useState(false);

  const fetchCategory = async () => {
    const { data = [] }: any = await apiGetCategorySelectBox();

    if (data) {
      const categories = formatCategoriesData(data);

      setCategories(categories);
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
          <span style={{ marginLeft: 10 }} className="whitespace-nowrap">
            <a title="View & Edit" href={'/products/' + record.id}>
              {name}
            </a>
          </span>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => <p className="text-ellipsis line-clamp-2">{description}</p>,
      width: 400,
    },
    {
      title: 'ThumbnailUrl',
      dataIndex: 'thumbnailUrl',
      key: 'thumbnailUrl',
      render: (thumbnailUrl: string) => <Image src={thumbnailUrl} width={200} />,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filterSearch: true,
      filters: categories!.map((category: Category) => ({ text: category.name, value: category.id })),

      render: (category: Category) => {
        return <Tag>{category.name}</Tag>;
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => numberToVND(price),
    },
    {
      title: 'Inventory',
      dataIndex: 'inventory',
      key: 'inventory',
      render: (inventory: number) => <Tag>{inventory}</Tag>,
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => <Tag>{weight}g</Tag>,
    },
    {
      title: 'Sale Price',
      dataIndex: 'salePrice',
      key: 'salePrice',
      render: (salePrice: number | null, record: any) =>
        salePrice && record.saleEndAt && dayjs(record.saleEndAt).isAfter(Date.now())
          ? numberToVND(salePrice)
          : 'No Sale',
    },
    {
      title: 'Sale End',
      dataIndex: 'saleEndAt',
      key: 'saleEndAt',
      render: (saleEndAt: string) =>
        saleEndAt && dayjs(saleEndAt).isAfter(Date.now()) ? dayjs(saleEndAt).format('DD/MM/YYYY HH:mm:ss') : 'No Sale',
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
