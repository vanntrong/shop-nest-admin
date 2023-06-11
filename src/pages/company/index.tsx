import { apiGetProductList } from '@/api/product.api';
import ImagePreview from '@/components/wikiblock/image-preview';
import { WikiTable } from '@/components/wikiblock/table';
import { Company } from '@/interface/company/company.interface';
import { Product } from '@/interface/product/product.interface';
import { useLocale } from '@/locales';
import { Button, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export const CompanyPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>();

  const fetchProducts = async () => {
    const { data = [] } = (await apiGetProductList({
      offset: 1,
      limit: 9999,
      sort_by: 'id',
      sort_order: 'ASC',
    })) as any;

    setProducts(
      data.map((item: Product) => ({
        text: item.name,
        value: item.id,
      })),
    );
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns: ColumnsType<Company> = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string, { name }) => <ImagePreview src={avatar} alt={name} text={name} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Founders',
      key: 'founders',
      dataIndex: 'founders',
      render: (_, { founders }) => (
        <>
          {founders?.map(founder => {
            return <Tag key={founder?.name}></Tag>;
          })}
        </>
      ),
    },
    {
      title: 'Products',
      key: 'products',
      dataIndex: 'products',
      filtered: true,
      filters: products,
      filterSearch: true,
      render: (_, { products }) => (
        <>
          {products?.map(product => {
            return <Tag key={product}>{product}</Tag>;
          })}
        </>
      ),
    },
  ];
  const addCompany = () => {
    const path = `/company/add`;

    return navigate(path);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }} className="float-right">
        <Button
          type="primary"
          onClick={() => {
            addCompany();
          }}
        >
          {formatMessage({ id: 'app.company.list.add_company' })}
        </Button>
      </div>
      {products && <WikiTable name="company" columns={columns} api="companies" />}
    </div>
  );
};
