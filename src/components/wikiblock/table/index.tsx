import { request } from '@/api/request';
import { LoadingOutlined } from '@ant-design/icons';
import { Input, message, Popconfirm, Space, Spin, Table, TableProps } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { SorterResult } from 'antd/es/table/interface';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useLocale } from '@/locales';
import dayjs from 'dayjs';
import { createSearchParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { debounce, omit } from 'lodash';

interface Props {
  name: string;
  columns: ColumnsType<any>;
  api?: string;
  filter?: any;
}

interface Params {
  pagination?: TablePaginationConfig;
  sorter?: SorterResult<any> | SorterResult<any>[];
  total?: number;
  sortField?: string;
  sortOrder?: string;
  keyword?: string;
}

const { Search } = Input;

export const WikiTable: FC<Props> = ({ name, columns, api, filter }) => {
  const { formatMessage } = useLocale();
  const [idDeleting, setIdDeleting] = useState('');
  const antIcon = <LoadingOutlined style={{ fontSize: 15 }} spin />;
  // const navigate = useNavigate();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSetParamsSuccess, setIsSetParamsSuccess] = useState(false);
  // const [filterColumns, setFilterColumns] = useState([]);

  const _columns = useMemo(() => {
    return [
      ...columns,
      {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'createdAt',
        render: (createdAt: any) => (
          <span className="whitespace-nowrap">{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        ),
        sorter: true,
        defaultSortOrder:
          searchParams.get('sort_by') === 'created_at'
            ? searchParams.get('sort_order') === 'DESC'
              ? 'descend'
              : ('ascend' as any)
            : undefined,
      },
      {
        title: 'Deleted',
        dataIndex: 'deleted',
        key: 'deleted',
        render: (deleted: any) => (
          <span className="whitespace-nowrap w-full flex justify-center">{deleted ? 'true' : 'false'}</span>
        ),
        sorter: true,
        defaultSortOrder:
          searchParams.get('sort_by') === 'deleted'
            ? searchParams.get('sort_order') === 'DESC'
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
      {
        title: 'Action',
        key: 'action',
        render: (_: any, record: any) => (
          <Space size="middle">
            <Link to={'/' + name + '/' + record.id}>{formatMessage({ id: 'global.tips.edit' })}</Link>

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

            {record.deleted && (
              <Popconfirm
                placement="left"
                title={formatMessage({ id: 'global.tips.recoverConfirm' })}
                onConfirm={() => {
                  // deleteItem(record.id);
                  // to be update
                }}
                okText={formatMessage({ id: 'global.tips.yes' })}
                cancelText={formatMessage({ id: 'global.tips.no' })}
              >
                <a className="flex items-center">
                  {idDeleting == record.id && <Spin indicator={antIcon} />}&nbsp;
                  {formatMessage({ id: 'global.tips.recover' })}
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
  });
  const sortDefault = 'created_at';

  useEffect(() => {
    setParams({
      pagination: {
        current: Number(searchParams.get('offset')) || 1,
        pageSize: Number(searchParams.get('limit')) || 10,
      },
      sortField: searchParams.get('sort_by') || sortDefault,
      sortOrder: searchParams.get('sort_order') && searchParams.get('sort_order') === 'ASC' ? 'ASC' : 'DESC',
      keyword: searchParams.get('q') || undefined,
    });
    !isSetParamsSuccess && setIsSetParamsSuccess(true);
  }, [searchParams]);

  const deleteItem = async (id: string) => {
    setLoading(true);
    setIdDeleting(id);
    const result: any = await request<any[]>(
      'delete',
      '/private/' + (api || name) + '/' + id,
      {},
      {
        baseURL: import.meta.env.VITE_API_URL,
      },
    );

    if (result || typeof result === 'string') {
      setLoading(false);
      // if (result.items.length) {
      //   setData(result.items);
      //   setPagination({ ...params.pagination, total: result.total_count, });
      // }
      message.info(formatMessage({ id: 'global.tips.deleteSuccess' }).replace('{0}', id));

      fetchData(params);
    }
  };

  // const addItem = () => {
  //   const path = `/` + name + `/add`;

  //   return navigate(path);
  // };

  const fetchData = async (params: Params = {}, filter?: any) => {
    setLoading(true);
    const sortField = params.sortField || sortDefault;
    const sortOrder = params.sortOrder || 'DESC';
    const search = params.keyword?.length ? params.keyword : undefined;

    try {
      const { data = [], paging = { count: 10, has_next: false, total: 10 } }: any = await request<any[]>(
        'get',
        '/public/' + (api || name),
        {},
        {
          baseURL: import.meta.env.VITE_API_URL,
          params: {
            offset: params?.pagination?.current,
            limit: params?.pagination?.pageSize,
            sort_by: sortField,
            sort_order: sortOrder,
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
          pagination: {
            current: params?.pagination?.current || prev.pagination?.current,
            pageSize: params.pagination?.pageSize || prev.pagination?.pageSize,
            total: paging.total,
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
        offset: newPagination.current?.toString() || '1',
        limit: newPagination.pageSize?.toString() || '10',
        sort_by: !order ? sortDefault : (field as string),
        sort_order: !order || order === 'descend' ? 'DESC' : 'ASC',
      })}`,
    });

    fetchData({
      pagination: newPagination,
      ...filters,
      sortField: !order ? sortDefault : (field as string),
      sortOrder: !order ? undefined : order === 'ascend' ? 'ASC' : 'DESC',
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
    // navigate({
    //   pathname: '/' + name,
    //   search: `${createSearchParams({
    //     offset: params.pagination?.current?.toString() || '1',
    //     limit: params.pagination?.pageSize?.toString() || '10',
    //     sort_by: params.sortField || sortDefault,
    //     sort_order: params.sortOrder || 'DESC',
    //     q: value,
    //   })}`,
    // });
    debounceSearch(value);
    // fetchData({ ...params, q: value });
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
      />
    </div>
  );
};
