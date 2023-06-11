import { apiGetCategorySelectBox } from '@/api/category.api';
import ImagePreview from '@/components/wikiblock/image-preview';
import { WikiTable } from '@/components/wikiblock/table';
import { Category } from '@/interface/category/category.interface';
import { Coin } from '@/interface/coin/coin.interface';
import { useLocale } from '@/locales';
import { Button, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CoinPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>();

  const fetchCategories = async () => {
    const { data = [] } = (await apiGetCategorySelectBox()) as any;

    setCategories(
      data.map((item: Category) => ({
        text: item.name,
        value: item.id,
      })),
    );
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns: ColumnsType<Coin> = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (_, { name, avatar }) => {
        return <ImagePreview text={name} src={avatar} alt={name} size={'large'} shape="square" />;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Token',
      dataIndex: 'token_id',
      key: 'token_id',
    },
    {
      title: 'Categories',
      key: 'categories',
      dataIndex: 'categories',
      filtered: true,
      filters: categories,
      filterSearch: true,
      render: (_, { categories }) => (
        <>
          {categories?.map((category: any) => {
            return <Tag key={category.id}>{category.title}</Tag>;
          })}
        </>
      ),
    },
    {
      title: 'Wallets',
      key: 'wallets',
      dataIndex: 'wallets',
      render: (wallets = []) => (
        <>
          {wallets?.map((wallet: any) => {
            return <Tag key={wallet}>{wallet}</Tag>;
          })}
        </>
      ),
    },

    {
      title: 'Blockchains',
      key: 'blockchains',
      dataIndex: 'blockchains',
      render: (blockchains = []) => (
        <>
          {blockchains?.map((blockchain: any) => {
            return <Tag key={blockchain}>{blockchain}</Tag>;
          })}
        </>
      ),
    },
  ];
  const addCoin = () => {
    const path = `/assets/add`;

    return navigate(path);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }} className="float-right">
        <Button
          type="primary"
          onClick={() => {
            addCoin();
          }}
        >
          {formatMessage({ id: 'app.coin.list.add_coin' })}
        </Button>
      </div>
      {categories && <WikiTable name="assets" columns={columns} api="assets" />}
    </div>
  );
};
