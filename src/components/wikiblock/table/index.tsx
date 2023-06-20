import { request } from '@/api/request';
import { LoadingOutlined } from '@ant-design/icons';
import { Input, message, Popconfirm, Space, Spin, Table, TableProps, Tag } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useLocale } from '@/locales';
import dayjs from 'dayjs';
import { createSearchParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { debounce, isNil, isUndefined, omit, omitBy } from 'lodash';

interface Props extends TableProps<any> {
  name: string;
  columns: ColumnsType<any>;
  api?: string;
  filter?: any;
  hideActions?: boolean;
  defaultParams?: Params;
}

interface Params {
  pagination?: TablePaginationConfig;
  sorter?: SorterResult<any> | SorterResult<any>[];
  total?: number;
  sortField?: string;
  sortOrder?: string;
  keyword?: string;
  minLevel?: number;
  maxLevel?: number;
}

const { Search } = Input;

export const WikiTable: FC<Props> = ({ name, columns, api, filter, hideActions = false, defaultParams, ...props }) => {
  const { formatMessage } = useLocale();
  const [idDeleting, setIdDeleting] = useState('');
  const antIcon = <LoadingOutlined style={{ fontSize: 15 }} spin />;
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSetParamsSuccess, setIsSetParamsSuccess] = useState(false);

  const _columns = useMemo(() => {
    return [
      ...columns,
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt: any) => (
          <span className="whitespace-nowrap">{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
        sorter: true,
        defaultSortOrder:
          searchParams.get('sortBy') === 'createdAt'
            ? searchParams.get('sortOrder') === 'desc'
              ? 'descend'
              : ('ascend' as any)
            : undefined,
      },
      {
        title: 'Deleted',
        dataIndex: 'isDeleted',
        key: 'isDeleted',
        render: (deleted: any) => <Tag color={deleted ? '#87d068' : '#f50'}>{deleted ? 'True' : 'False'}</Tag>,
        sorter: true,
        defaultSortOrder:
          searchParams.get('sortBy') === 'deleted'
            ? searchParams.get('sortOrder') === 'desc'
              ? 'descend'
              : ('ascend' as any)
            : undefined,
        filtered: true,
        filters: [
          {
            text: 'Deleted',
            value: true,
          },
        ],
      },
      hideActions
        ? {}
        : {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
              <Space size="middle">
                <Link to={'/' + name + '/' + record.id}>{formatMessage({ id: 'global.tips.edit' })}</Link>

                {record.isDeleted ? (
                  <Popconfirm
                    placement="left"
                    title={formatMessage({ id: 'global.tips.recoverConfirm' })}
                    onConfirm={() => {
                      recoverItem(record.id);
                    }}
                    okText={formatMessage({ id: 'global.tips.yes' })}
                    cancelText={formatMessage({ id: 'global.tips.no' })}
                  >
                    <a className="flex items-center">
                      {idDeleting == record.id && <Spin indicator={antIcon} />}&nbsp;
                      {formatMessage({ id: 'global.tips.recover' })}
                    </a>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    placement="left"
                    title={formatMessage({ id: 'global.tips.deleteConfirm' })}
                    onConfirm={() => {
                      deleteItem(record.id);
                    }}
                    okText={formatMessage({ id: 'global.tips.yes' })}
                    cancelText={formatMessage({ id: 'global.tips.no' })}
                  >
                    <a className="flex items-center">
                      {idDeleting === record.id && <Spin indicator={antIcon} />}&nbsp;
                      {formatMessage({ id: 'global.tips.delete' })}
                    </a>
                  </Popconfirm>
                )}
              </Space>
            ),
          },
    ];
  }, []);

  const [params, setParams] = useState<Params>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    ...defaultParams,
  });
  const sortDefault = 'createdAt';

  useEffect(() => {
    setParams({
      ...params,
      pagination: {
        current: Number(searchParams.get('offset')) || 1,
        pageSize: Number(searchParams.get('limit')) || 10,
      },
      sortField: searchParams.get('sortBy') || sortDefault,
      sortOrder: searchParams.get('sortOrder') && searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc',
      keyword: searchParams.get('q') || undefined,
    });
    !isSetParamsSuccess && setIsSetParamsSuccess(true);
  }, [searchParams]);

  const deleteItem = async (id: string) => {
    setLoading(true);
    setIdDeleting(id);
    const result: any = await request<any[]>(
      'delete',
      '/' + (api || name) + '/' + id,
      {},
      {
        baseURL: import.meta.env.VITE_API_URL,
      },
    );

    if (result || typeof result === 'string') {
      setLoading(false);

      message.info(formatMessage({ id: 'global.tips.deleteSuccess' }).replace('{0}', id));

      fetchData(params);
    }
  };

  const recoverItem = async (id: string) => {
    setLoading(true);

    await request<any[]>(
      'patch',
      '/' + (api || name) + '/' + id + '/restore',
      {},
      {
        baseURL: import.meta.env.VITE_API_URL,
      },
    );

    fetchData(params);
  };

  const fetchData = async (params: Params = {}, filter?: any) => {
    setLoading(true);
    const sortField = params.sortField || sortDefault;
    const sortOrder = params.sortOrder || 'desc';
    const search = params.keyword?.length ? params.keyword : undefined;

    try {
      const { data = [], total = 10 }: any = await request<any[]>(
        'get',
        '/' + (api || name),
        {},
        {
          baseURL: import.meta.env.VITE_API_URL,
          params: {
            offset: (params?.pagination?.current ?? 1) - 1,
            limit: params?.pagination?.pageSize,
            sortBy: sortField,
            sortOrder: sortOrder,
            keyword: search,
            ...omit(params, ['pagination', 'sortField', 'sortOrder', 'q']),
            ...(filter ?? {}),
          },
        },
      );

      if (data) {
        setLoading(false);
        setData(data);
        setParams(prev => ({
          ...prev,
          pagination: {
            current: params?.pagination?.current || prev.pagination?.current,
            pageSize: params.pagination?.pageSize || prev.pagination?.pageSize,
            total: total,
          },
          sortField,
          sortOrder,
          keyword: search,
        }));
      }
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSetParamsSuccess) {
      fetchData(params, filter);
    }
  }, [isSetParamsSuccess, filter]);

  const handleTableChange: TableProps<any>['onChange'] = (
    // newPagination: TablePaginationConfig,
    // filters: Record<string, FilterValue | null>,
    // sorter: SorterResult<any>,
    newPagination,
    filters,
    sorter,
  ) => {
    const { field, order } = sorter as SorterResult<any>;

    const filtersObject = Object.keys(filters).reduce((acc, key) => {
      const filterValues = filters[key];

      if (filterValues && filterValues.length) {
        return {
          ...acc,
          [key]: key.includes('date') || key === 'deleted' ? filterValues[0] : filterValues,
        };
      }

      return acc;
    }, {});

    navigate({
      pathname: '/' + name,
      search: `${createSearchParams({
        ...omitBy(omit(params, 'pagination'), [isNil, isUndefined]),
        offset: newPagination.current?.toString() || '1',
        limit: newPagination.pageSize?.toString() || '10',
        sortBy: !order ? sortDefault : (field as string),
        sortOrder: !order || order === 'descend' ? 'desc' : 'asc',
      })}`,
    });

    fetchData({
      ...params,
      pagination: newPagination,
      ...filters,
      sortField: !order ? sortDefault : (field as string),
      sortOrder: !order ? undefined : order === 'ascend' ? 'asc' : 'desc',
      ...filtersObject,
    });
  };

  const debounceSearch = useCallback(
    debounce((value: string) => {
      fetchData({ ...params, keyword: value });
    }, 300),
    [params],
  );

  const onSearch = (value: string) => {
    debounceSearch(value);
  };

  return (
    <div>
      <Search
        placeholder="input search text"
        style={{ marginBottom: 10, maxWidth: 200 }}
        onChange={e => onSearch(e.target.value)}
        defaultValue={searchParams.get('q') || undefined}
      />

      <Table
        columns={_columns}
        rowKey={record => record.id}
        dataSource={data}
        pagination={params.pagination}
        loading={loading}
        onChange={handleTableChange}
        {...props}
      />
    </div>
  );
};
