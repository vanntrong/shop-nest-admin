import { apiGetCategoryList } from '@/api/category.api';
import { apiAddCoin, apiGetBlockchainSelectBox, apiGetCoinItem, apiUpdateCoin } from '@/api/coin.api';
import { apiGetProductList } from '@/api/product.api';
import ExplorerForm from '@/components/wikiblock/explorer-form';
import SocialForm from '@/components/wikiblock/social-form';
import WikiUploadImage from '@/components/wikiblock/upload-image-v2';
import { Category } from '@/interface/category/category.interface';
import { Coin } from '@/interface/coin/coin.interface';
import { Fund } from '@/interface/fund/fund.interface';
import { Product } from '@/interface/product/product.interface';
import { useLocale } from '@/locales';
import { formatDataPayload, formatTrans, uploadImages } from '@/utils/helper';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker as D, Divider, Form, Input, message, Select, Space, Switch } from 'antd';
import 'antd/dist/antd.css';
import { debounce, isEmpty, omitBy } from 'lodash';
import moment from 'moment';
import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const { TextArea } = Input;
const { Option } = Select;
const DatePicker = D as any;

export const CoinDetailPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const [dataItem, setDataItem] = useState<any>({});
  const [coins] = useState<Fund>();
  // const [children, setChildren] = useState<Array<any>>([]);
  const [categories, setCategories] = useState<any>([]);
  // const [blockchains, setBlockchains] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [avatar, setAvatar] = useState<string>();
  const { id } = useParams();
  const [form] = Form.useForm();

  const fetchCategory = async (search?: string) => {
    const { data = [] }: any = await apiGetCategoryList({
      keyword: search,
    });

    if (data.length > 0) setCategories(data);
  };

  const fetchProducts = async (search?: string) => {
    const { data = [] }: any = await apiGetProductList({
      keyword: search,
    });

    if (data.length > 0) setProducts(data);
  };

  const fetchItem = async (detailId: string) => {
    const { trans, ...result }: any = await apiGetCoinItem(detailId, '');

    if (result) {
      const _trans = trans.length > 0 ? trans : [{ lang: 'vi', services: [], features: [], about: '' }];
      const vi = _trans.find((i: any) => i.lang === 'vi');
      const servicesVi = vi.services || [];
      const item = {
        ...result,
        // services: [{ en: result.services.join(', '), vi: vi.services?.join(', ') || '' }],
        services: result.services?.map((service: string, index: number) => ({
          en: service,
          vi: servicesVi[index] || '',
        })),
        categories: result.categories?.map((i: any) => i.id) ?? [],
        ico: {
          ...result.ico,
          start_date: moment(result.ico?.start_date) || moment(),
          end_date: moment(result.ico?.end_date) || moment(),
        },
        trans: _trans,
      };

      form.setFieldsValue(item);
      setDataItem(item);
      setAvatar(result.avatar);

      setCategories((prev: any) => {
        const categories = [...prev];

        result.categories.forEach((cate: Category) => {
          const index = categories.findIndex((c: any) => c.id === cate.id);

          index === -1 && categories.push(cate);
        });

        return categories;
      });
    }
  };

  const fetchBlockchain = async () => {
    const allBlockchain: any = await apiGetBlockchainSelectBox();

    if (allBlockchain.items && allBlockchain.items.length > 0) {
      // setBlockchains(allBlockchain.items);
    }
  };
  const updateItem = async (data: Coin, detailId?: string) => {
    let result: any;

    data = formatTrans(data, 'services');
    data = formatDataPayload(data) as Coin;

    if (data.trans?.length) {
      data.trans = data.trans?.map(item => formatDataPayload(item)) as any;
    }

    if (avatar) {
      message.loading({ content: 'Uploading avatar...', key: 'uploading' });
      data.avatar = (await uploadImages([avatar], 'coins'))[0];
      message.success({ content: 'Uploaded avatar', key: 'uploading' });
    }

    if (detailId) {
      // Update
      result = await apiUpdateCoin(detailId, data);
    } else {
      // Add
      result = await apiAddCoin(data);
    }
    if (result) {
      if (detailId) {
        message.info(formatMessage({ id: 'global.tips.updateSuccess' }).replace('{0}', detailId));
        fetchItem(detailId);
      } else {
        message.info(formatMessage({ id: 'global.tips.createSuccess' }).replace('{0}', result.id));
        const path = `/coin`;

        return navigate(path);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchItem(id);
      fetchBlockchain();
    }

    // Load Category
    fetchCategory();
    // Load Service
    fetchProducts();

    // Load Exchange

    // Load Wallet

    // Load Team
  }, [id]);

  const onFinish = (values: any) => {
    updateItem(omitBy(values, isEmpty) as any, id);
  };

  const onReset = () => {
    form.resetFields();
  };

  const debounceSearchCategory = useCallback(
    debounce(value => {
      const searchValue = value.length > 0 ? value : undefined;

      fetchCategory(searchValue);
    }, 200),
    [],
  );

  const debounceSearchProducts = useCallback(
    debounce(value => {
      const searchValue = value.length > 0 ? value : undefined;

      fetchProducts(searchValue);
    }, 200),
    [],
  );

  return (
    <div className="p-3 bg-white">
      <Form form={form} name="control-hooks" onFinish={onFinish}>
        {dataItem.id && (
          <FormItem label="ID">
            <Input value={dataItem.id} disabled />
          </FormItem>
        )}
        <FormItemWrapper>
          <FormItem name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="symbol" label="Symbol" rules={[{ required: true }]}>
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <Divider orientation="left" style={{ fontWeight: '100' }}>
          About
        </Divider>
        <div className="flex items-center gap-x-[20px]">
          <FormItem name="about" label="en" rules={[]} className="flex-1" labelWidth={80}>
            <TextArea rows={4} />
          </FormItem>
          <FormItem name="trans" className="flex-1" style={{ marginBottom: 0 }}>
            <Form.List name="trans" initialValue={coins?.trans}>
              {(fields, { add }) => (
                <>
                  {fields.length === 0 && add()}
                  {fields.map((field, index) => (
                    <div key={field.key} className="flex items-center">
                      <FormItem
                        name={[field.name, 'lang']}
                        style={{ display: 'none' }}
                        initialValue={coins?.trans ? coins.trans[index].lang : 'vi'}
                      >
                        <Input type="text" value={coins?.trans ? coins.trans[index].lang : 'vi'} />
                      </FormItem>
                      <FormItem
                        name={[field.name, 'about']}
                        label={coins?.trans ? coins.trans[index].lang : 'vi'}
                        style={{ width: '100%' }}
                        labelWidth={80}
                      >
                        <TextArea rows={4} />
                      </FormItem>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </FormItem>
        </div>
        <Divider></Divider>

        <FormItem label="Avatar">
          <WikiUploadImage
            fileList={avatar ? [avatar] : []}
            onChange={file => setAvatar(file)}
            onRemoveItem={() => setAvatar(undefined)}
            showUploadList
            limit={1}
          />
        </FormItem>

        <SocialForm />

        {/* <FormItemWrapper>
          <FormItem name="explorer" label="Explorer">
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper> */}

        <ExplorerForm />

        <FormItem label="Blockchains">
          <Form.List name="blockchains">
            {(fields, { add, remove }) => (
              <Fragment>
                {fields.map(field => {
                  return (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8, width: '100%' }} align="baseline">
                      <FormItem {...field}>
                        <Input style={{ width: 400 }} placeholder="blockchain" />
                      </FormItem>

                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  );
                })}
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  icon={<PlusOutlined />}
                >
                  Add Blockchain
                </Button>
              </Fragment>
            )}
          </Form.List>
        </FormItem>

        {/* <FormItemWrapper>
          <FormItem name="whitepaper" label="Whitepaper">
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper> */}

        <FormItemWrapper>
          <FormItem name="categories" label="Categories">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="select one category"
              optionLabelProp="label"
              filterOption={(input, option) => {
                return (option!.label as string).toLowerCase().includes(input.toLowerCase());
              }}
              onSearch={value => debounceSearchCategory(value)}
            >
              {categories?.map(({ id, name, title }: Category) => {
                return (
                  <Option value={id} label={name || title} key={id}>
                    <div className="demo-option-label-item">{name || title}</div>
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="product" label="Product">
            <Select
              style={{ width: '100%' }}
              placeholder="select one product"
              optionLabelProp="label"
              showSearch
              filterOption={(input, option) => {
                return (option!.label as string).toLowerCase().includes(input.toLowerCase());
              }}
              onSearch={value => debounceSearchProducts(value)}
            >
              {products?.map(({ id, name, slug = '' }: Product) => {
                return (
                  <Option value={slug} label={name} key={id}>
                    <div className="demo-option-label-item">{name}</div>
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItem label="Services">
          <Form.List name="services">
            {(fields, { add, remove }) => (
              <Fragment>
                {fields.map(field => {
                  return (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8, width: '100%' }} align="baseline">
                      <FormItem name={[field.name, 'en']}>
                        <TextArea rows={4} style={{ width: 400 }} placeholder="English" />
                      </FormItem>
                      <FormItem name={[field.name, 'vi']}>
                        <TextArea rows={4} style={{ width: 400 }} placeholder="Vietnamese" />
                      </FormItem>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  );
                })}
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  icon={<PlusOutlined />}
                >
                  Add Services
                </Button>
              </Fragment>
            )}
          </Form.List>
        </FormItem>
        <Divider></Divider>
        <FormItem name="technologies" label="Technologies">
          <FormItemWrapper>
            <FormItem name={['technologies', 'blockchain']}>
              <Input addonBefore={<div className="min-w-[120px]">Blockchain</div>} />
            </FormItem>
            <div className="flex-1"></div>
          </FormItemWrapper>
          <FormItemWrapper>
            <FormItem name={['technologies', 'consensus']}>
              <Input addonBefore={<div className="min-w-[120px]">Consensus</div>} />
            </FormItem>
            <div className="flex-1"></div>
          </FormItemWrapper>
          <FormItemWrapper>
            <FormItem name={['technologies', 'hash_algorithm']}>
              <Input addonBefore={<div className="min-w-[120px]">Hash algorithm</div>} />
            </FormItem>
            <div className="flex-1"></div>
          </FormItemWrapper>
          <FormItemWrapper>
            <FormItem name={['technologies', 'org_structure']}>
              <Input addonBefore={<div className="min-w-[120px]">Org structure</div>} />
            </FormItem>
            <div className="flex-1"></div>
          </FormItemWrapper>
          <FormItemWrapper>
            <FormItem name={['technologies', 'open_source']}>
              <Input addonBefore={<div className="min-w-[120px]">Open source</div>} />
            </FormItem>
            <div className="flex-1"></div>
          </FormItemWrapper>
          <FormItemWrapper>
            <FormItem name={['technologies', 'development_status']}>
              <Input addonBefore={<div className="min-w-[120px]">Development status</div>} />
            </FormItem>
            <div className="flex-1"></div>
          </FormItemWrapper>
          <FormItemWrapper>
            <FormItem name={['technologies', 'hardware_wallet']}>
              <Input addonBefore={<div className="min-w-[120px]">Hardware wallet</div>} />
            </FormItem>
            <div className="flex-1"></div>
          </FormItemWrapper>
        </FormItem>

        <FormItem label="Features">
          <Form.List name="features">
            {(fields, { add, remove }) => (
              <Fragment>
                {fields.map(field => {
                  return (
                    dataItem?.features && (
                      <Space
                        key={field.key}
                        style={{ display: 'flex', marginBottom: 8, width: '100%' }}
                        align="baseline"
                      >
                        <FormItem name={[field.name, 'en']}>
                          <TextArea rows={4} style={{ width: 400 }} placeholder="English" />
                        </FormItem>
                        <FormItem name={[field.name, 'vi']}>
                          <TextArea rows={4} style={{ width: 400 }} placeholder="Vietnamese" />
                        </FormItem>
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Space>
                    )
                  );
                })}
                <Button
                  className="min-w-[160px]"
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  icon={<PlusOutlined />}
                >
                  Add Features
                </Button>
              </Fragment>
            )}
          </Form.List>
        </FormItem>

        <FormItem label="Exchanges">
          <Form.List name="exchanges">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item {...field}>
                      <Input
                        placeholder="Exchanges"
                        defaultValue={dataItem.exchanges && dataItem.exchanges[index] ? dataItem?.exchanges[index] : ''}
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button className="min-w-[160px]" type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Exchanges
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>
        <FormItem label="Wallets">
          <Form.List name="wallets">
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item name={[field.name, 'name']}>
                      <Input
                        placeholder="Wallet name"
                        // defaultValue={dataItem.wallets && dataItem.wallets[index] ? dataItem?.wallets[index] : ''}
                      />
                    </Form.Item>
                    <Form.Item name={[field.name, 'address']}>
                      <Input placeholder="Wallet address" />
                    </Form.Item>
                    <Form.Item name={[field.name, 'explore_url']} rules={[{ type: 'url' }]}>
                      <Input placeholder="Wallet URL" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button className="min-w-[160px]" type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Wallets
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>
        <FormItem label="Team">
          <Form.List name="team" initialValue={dataItem.team}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item name={[field.name, 'name']}>
                      <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item name={[field.name, 'position']}>
                      <Input placeholder="Position" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button className="min-w-[160px]" type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Team
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>
        <FormItem name="ico" label="Ico" rules={[{ required: true }]}>
          <FormItem name={['ico', 'start_date']}>
            <DatePicker
              placeholder="Start Date"
              // defaultValue={dataItem.ico ? moment(dataItem.ico.start_date, dateFormat) : null}
            />
          </FormItem>
          <FormItem name={['ico', 'end_date']}>
            <DatePicker />
          </FormItem>
          <FormItemWrapper>
            <FormItem name={['ico', 'soft_cap']}>
              <Input addonBefore={<div className="min-w-[100px]">Soft cap</div>} />
            </FormItem>
            <div className="flex-1"></div>
          </FormItemWrapper>
          <FormItemWrapper>
            <FormItem name={['ico', 'total_supply']}>
              <Input addonBefore={<div className="min-w-[100px]">Total supply</div>} />
            </FormItem>
            <div className="flex-1"></div>
          </FormItemWrapper>
          <FormItemWrapper>
            <FormItem name={['ico', 'investor_supply']}>
              <Input addonBefore={<div className="min-w-[100px]">Investor supply</div>} />
            </FormItem>
            <div className="flex-1"></div>
          </FormItemWrapper>
          <FormItemWrapper>
            <FormItem name={['ico', 'market_cap_at']}>
              <Input addonBefore={<div className="min-w-[100px]">Market cap at</div>} />
            </FormItem>
            <div className="flex-1"></div>
          </FormItemWrapper>
          <FormItemWrapper>
            <FormItem name={['ico', 'conversion']}>
              <Input addonBefore={<div className="min-w-[100px]">Conversion</div>} />
            </FormItem>
            <div className="flex-1"></div>
          </FormItemWrapper>
        </FormItem>
        <FormItemWrapper>
          <FormItem name="potential" label="Potential">
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="reliability" label="Reliability">
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItemWrapper>
          <FormItem name="rating" label="Rating">
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="year" label="Year">
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="market" label="Market">
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="market_share" label="Market Share" valuePropName="checked">
            <Switch />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="dapp" label="Dapp">
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="founded" label="Founded">
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="tvl_ratio" label="Tvl Ratio">
            <Input type="number" min={0} />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="num_market_pairs" label="Num Market Pairs">
            <Input type="number" min={0} />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="market_cap" label="Market Cap">
            <Input type="number" min={0} />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="self_reported_market_cap" label="Self Reported Market Cap">
            <Input type="number" min={0} />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="market_cap_dominance" label="Market Cap Dominance">
            <Input type="number" min={0} />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="fully_diluted_market_cap" label="Fully Diluted Market Cap">
            <Input type="number" min={0} />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="market_cap_by_total_supply" label="Market Cap By Total Supply">
            <Input type="number" min={0} />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="total_supply" label="Total Supply">
            <Input type="number" min={0} />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="circulating_supply" label="Circulating Supply">
            <Input type="number" min={0} />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="self_reported_circulating_supply" label="Self Reported Circulating Supply">
            <Input type="number" min={0} />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="max_supply" label="Max Supply">
            <Input type="number" min={0} />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="price" label="Price">
            <Input type="number" min={0} />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="cmc_rank" label="CMC Rank">
            <Input type="number" min={0} />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        {/* {dataItem.market_data && (
          <FormItem name="market_data" label="Market Data">
            {Object.keys(dataItem.market_data).map(currency => {
              return (
                <>
                  <Divider orientation="left" style={{ fontWeight: '100' }}>
                    {currency}
                  </Divider>
                  <FormItemWrapper>
                    <FormItem name={['market_data', currency, 'last_updated']}>
                      <Input addonBefore={currency + ' Last Updated'} />
                    </FormItem>
                    <div className="flex-1"></div>
                  </FormItemWrapper>
                  <FormItemWrapper>
                    <FormItem name={['market_data', currency, 'market_cap']}>
                      <Input addonBefore={currency + ' Market Cap'} />
                    </FormItem>
                    <div className="flex-1"></div>
                  </FormItemWrapper>
                  <FormItemWrapper>
                    <FormItem name={['market_data', currency, 'market_cap_dominance']}>
                      <Input addonBefore={currency + ' Market Cap Dominance'} />
                    </FormItem>
                    <div className="flex-1"></div>
                  </FormItemWrapper>
                  <FormItemWrapper>
                    <FormItem name={['market_data', currency, 'percent_change_1h']}>
                      <Input addonBefore={currency + ' Percent change 1h'} />
                    </FormItem>
                    <div className="flex-1"></div>
                  </FormItemWrapper>
                  <FormItemWrapper>
                    <FormItem name={['market_data', currency, 'percent_change_24h']}>
                      <Input addonBefore={currency + ' Percent change 24h'} />
                    </FormItem>
                    <div className="flex-1"></div>
                  </FormItemWrapper>
                  <FormItemWrapper>
                    <FormItem name={['market_data', currency, 'percent_change_30d']}>
                      <Input addonBefore={currency + ' Percent change 30d'} />
                    </FormItem>
                    <div className="flex-1"></div>
                  </FormItemWrapper>
                  <FormItemWrapper>
                    <FormItem name={['market_data', currency, 'percent_change_60d']}>
                      <Input addonBefore={currency + ' Percent change 60d'} />
                    </FormItem>
                    <div className="flex-1"></div>
                  </FormItemWrapper>
                  <FormItemWrapper>
                    <FormItem name={['market_data', currency, 'percent_change_7d']}>
                      <Input addonBefore={currency + ' Percent change 7d'} />
                    </FormItem>
                    <div className="flex-1"></div>
                  </FormItemWrapper>
                  <FormItemWrapper>
                    <FormItem name={['market_data', currency, 'percent_change_90d']}>
                      <Input addonBefore={currency + ' Percent change 90d'} />
                    </FormItem>
                    <div className="flex-1"></div>
                  </FormItemWrapper>
                  <FormItemWrapper>
                    <FormItem name={['market_data', currency, 'price']}>
                      <Input addonBefore={currency + ' Price'} />
                    </FormItem>
                    <div className="flex-1"></div>
                  </FormItemWrapper>
                  <FormItemWrapper>
                    <FormItem name={['market_data', currency, 'tvl']}>
                      <Input addonBefore={currency + ' Tvl'} />
                    </FormItem>
                    <div className="flex-1"></div>
                  </FormItemWrapper>
                  <FormItemWrapper>
                    <FormItem name={['market_data', currency, 'volume_24h']}>
                      <Input addonBefore={currency + ' Volume 24h'} />
                    </FormItem>
                    <div className="flex-1"></div>
                  </FormItemWrapper>
                  <FormItemWrapper>
                    <FormItem name={['market_data', currency, 'volume_change_24h']}>
                      <Input addonBefore={currency + ' Volume change 24h'} />
                    </FormItem>
                    <div className="flex-1"></div>
                  </FormItemWrapper>
                </>
              );
            })}
          </FormItem>
        )} */}
        {/********** Button Action ********/}
        <FormItem>
          <Button className="min-w-[160px]" type="primary" htmlType="submit">
            Submit
          </Button>
          <Button className="min-w-[160px]" htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};

const FormItem = styled(Form.Item)<any>`
  .ant-form-item-label label {
    width: fit-content;
    min-width: ${({ labelWidth = 250 }: any) => `${labelWidth}px`};
  }
  flex: 1;
`;

export const FormItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0 20px;
`;
