import { apiDeleteCategory, apiRecoverCategory } from '@/api/category.api';
import { WikiTable } from '@/components/wikiblock/table';
import { Category } from '@/interface/category/category.interface';
import { useLocale } from '@/locales';
import { Button, Popconfirm, Space, Table, TableColumnsType, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const CategoryPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();

  const columns: ColumnsType<Category> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      sorter: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Children Count',
      render: (_, record) => {
        return record.subCategories?.length || 0;
      },
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: any) => <Tag color={isActive ? '#87d068' : '#f50'}>{isActive ? 'True' : 'False'}</Tag>,
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (createdBy: any) => createdBy.name,
    },
  ];

  const addCategory = () => {
    const path = `/categories/add`;

    return navigate(path);
  };

  const deleteCategory = async (id: string) => {
    await apiDeleteCategory(id);
  };

  const recoverCategory = async (id: string) => {
    await apiRecoverCategory(id);
  };

  const expandedRowRender = (record: Category) => {
    const columns: TableColumnsType<Category> = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        sorter: true,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
      },
      {
        title: 'Children Count',
        render: (_, record) => {
          return record.subCategories?.length || 0;
        },
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt: any) => (
          <span className="whitespace-nowrap">{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
      },
      {
        title: 'Active',
        dataIndex: 'isActive',
        key: 'isActive',
        render: (isActive: any) => <Tag color={isActive ? '#87d068' : '#f50'}>{isActive ? 'True' : 'False'}</Tag>,
      },
      {
        title: 'Created By',
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (createdBy: any) => createdBy.name,
      },
      {
        title: 'Deleted',
        dataIndex: 'isDeleted',
        key: 'isDeleted',
        render: (deleted: any) => <Tag color={deleted ? '#87d068' : '#f50'}>{deleted ? 'True' : 'False'}</Tag>,
      },
      {
        title: 'Action',
        key: 'action',
        render: (_: any, record: any) => (
          <Space size="middle">
            <Link to={'/categories/' + record.id}>{formatMessage({ id: 'global.tips.edit' })}</Link>
            {record.isDeleted ? (
              <Popconfirm
                placement="left"
                title={formatMessage({ id: 'global.tips.recoverConfirm' })}
                onConfirm={() => {
                  recoverCategory(record.id);
                }}
                okText={formatMessage({ id: 'global.tips.yes' })}
                cancelText={formatMessage({ id: 'global.tips.no' })}
              >
                <a className="flex items-center">{formatMessage({ id: 'global.tips.recover' })}</a>
              </Popconfirm>
            ) : (
              <Popconfirm
                placement="left"
                title={formatMessage({ id: 'global.tips.deleteConfirm' })}
                onConfirm={() => {
                  deleteCategory(record.id);
                }}
                okText={formatMessage({ id: 'global.tips.yes' })}
                cancelText={formatMessage({ id: 'global.tips.no' })}
              >
                <a className="flex items-center">{formatMessage({ id: 'global.tips.delete' })}</a>
              </Popconfirm>
            )}
          </Space>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.subCategories}
        pagination={false}
        expandable={{
          expandedRowRender,
          rowExpandable: record => record.subCategories && record.subCategories.length > 0,
        }}
      />
    );
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
      <WikiTable
        name="categories"
        columns={columns}
        api="categories"
        expandable={{
          expandedRowRender,
          rowExpandable: record => record.subCategories && record.subCategories.length > 0,
        }}
        defaultParams={{
          maxLevel: 1,
          minLevel: 1,
        }}
      />
    </div>
  );
};
