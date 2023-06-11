/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Divider, Form, Input, message, Select, Space, Switch } from 'antd';
import 'antd/dist/antd.css';
import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const { TextArea } = Input;

import { apiGetCategoryList } from '@/api/category.api';
import { apiGetCoinList } from '@/api/coin.api';
import { apiGetPersonList } from '@/api/person.api';
import { apiAddProduct, apiGetProductItem, apiUpdateProduct } from '@/api/product.api';
import WikiUploadImage from '@/components/wikiblock/upload-image-v2';
import { Category } from '@/interface/category/category.interface';
import { Coin } from '@/interface/coin/coin.interface';
import { Product } from '@/interface/product/product.interface';
import { useLocale } from '@/locales';
import { formatDataPayload, formatTrans, uploadImages } from '@/utils/helper';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import styled from 'styled-components';
import SocialForm from '@/components/wikiblock/social-form';

const MAX_GALLERY_IMAGES = 5;
const MAX_GALLERY_IMAGE_SIZE = 5;

const appNameOptions = [
  {
    label: 'CH play',
    value: 'CH play',
  },
  {
    label: 'App store',
    value: 'App store',
  },
];

const teamNameOptions = [
  {
    label: 'Website',
    value: 'website',
  },
  {
    label: 'Facebook',
    value: 'facebook',
  },
  {
    label: 'Telegram',
    value: 'telegram',
  },
  {
    label: 'Twitter',
    value: 'twitter',
  },
  {
    label: 'Youtube',
    value: 'youtube',
  },
  {
    label: 'Discord',
    value: 'discord',
  },
  {
    label: 'Medium',
    value: 'medium',
  },
  {
    label: 'Reddit',
    value: 'reddit',
  },
  {
    label: 'Blog',
    value: 'blog',
  },
  {
    label: 'Rocket Chat',
    value: 'rocket_chat',
  },
];

// const layout = {
//   labelCol: { span: 8 },
//   wrapperCol: { span: 16 },
// };
// const tailLayout = {
//   wrapperCol: { offset: 8, span: 16 },
// };
const { Option } = Select;

export const uploadImage = async (options: any) => {
  const { onSuccess, onProgress } = options;

  setTimeout(() => {
    onSuccess('ok');
    onProgress({ percent: 100 });
  }, 200);
};

export const ProductDetailPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any>([]);
  const [coins, setCoins] = useState<any>([]);
  const [people, setPeople] = useState<any>([]);
  const [dataItem, setDataItem] = useState<any>({});
  const { id } = useParams();
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState<string>();
  const [galleries, setGalleries] = useState<any>([]);

  const fetchCategory = async (search?: string) => {
    const { data = [] }: any = await apiGetCategoryList({
      keyword: search,
    });

    if (data) {
      setCategories(data);
    }
  };

  const fetchCoin = async (search?: string) => {
    const { data = [] }: any = await apiGetCoinList({
      keyword: search,
    });

    if (data) {
      setCoins(data);
    }
  };

  const fetchPerson = async (search?: string) => {
    const { data = [] }: any = await apiGetPersonList({
      keyword: search,
    });

    if (data) {
      setPeople(data);
    }
  };
  const fetchItem = async (detailId: string) => {
    const { trans, ...result }: any = await apiGetProductItem(detailId);

    if (result) {
      const _trans = trans.length > 0 ? trans : [{ lang: 'vi', name: '', about: '', features: [] }];
      const vi = _trans.find((i: any) => i.lang === 'vi');
      const featuresVi = vi.features || [];
      const item = {
        ...result,
        // features: [{ en: result.features.join(', '), vi: vi.features?.join(', ') || '' }],
        features: result.features.map((feature: string, index: number) => ({
          en: feature,
          vi: featuresVi[index] || '',
        })),
        categories: result.categories.map((cat: Category) => cat.id),
        cryptocurrencies: result.cryptocurrencies.map((coin: Coin) => coin.id),
        trans: _trans,
      };

      form.setFieldsValue(item);
      setDataItem(item);
      setAvatar(item.avatar ?? '');
      setGalleries(item.gallery ?? []);

      setCoins((prev: any) => {
        const coins = [...prev];

        result.cryptocurrencies.forEach((coin: Coin) => {
          const index = coins.findIndex((c: any) => c.id === coin.id);

          index === -1 && coins.push(coin);
        });

        return coins;
      });

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

  const updateItem = async (data: Product, detailId?: string) => {
    let result: any;

    data = formatTrans(data, 'features');

    data = formatDataPayload(data) as Product;

    if (data.trans?.length) {
      data.trans = data.trans.map(item => formatDataPayload(item)) as any;
    }

    if (avatar) {
      message.loading({ content: 'Uploading avatar...', key: 'avatar' });
      data.avatar = (await uploadImages([avatar], 'products'))[0];
      message.success({ content: 'Upload avatar success!', key: 'avatar' });
    }

    if (galleries && galleries.length) {
      message.loading({ content: 'Uploading galleries...', key: 'galleries' });
      data.galleries = await uploadImages(galleries, 'products');
      message.success({ content: 'Upload galleries success!', key: 'galleries' });
    }

    if (detailId) {
      // Update
      result = await apiUpdateProduct(detailId, data);
    } else {
      // Add
      result = await apiAddProduct(data);
    }
    if (result) {
      if (detailId) {
        message.info(formatMessage({ id: 'global.tips.updateSuccess' }).replace('{0}', detailId));
        fetchItem(detailId);
      } else {
        message.info(formatMessage({ id: 'global.tips.createSuccess' }).replace('{0}', result.id));
        const path = `/product`;

        return navigate(path);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchItem(id);
    }
    fetchCategory();
    fetchCoin();
    fetchPerson();
  }, [id]);

  const onFinish = (values: any) => {
    updateItem(values, dataItem.id);
  };

  const onReset = () => {
    form.resetFields();
    setAvatar(dataItem.avatar ?? '');
    setGalleries(dataItem.gallery ?? []);
  };

  const debounceSearchCoin = useCallback(
    debounce(value => {
      const searchValue = value.length > 0 ? value : undefined;

      fetchCoin(searchValue);
    }, 300),
    [],
  );

  // const debounceSearchPerson = useCallback(
  //   debounce(value => fetchPerson(value), 300),
  //   [],
  // );

  const debounceSearchCategory = useCallback(
    debounce(value => {
      const searchValue = value.length > 0 ? value : undefined;

      fetchCategory(searchValue);
    }, 300),
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
          {/* <FormItem name="trans" className="flex-1" style={{ marginBottom: 0 }}>
            <Form.List name="trans" initialValue={dataItem.trans}>
              {(fields, { add }) => (
                <>
                  {fields.length === 0 && add()}
                  {fields.map((field, index) => (
                    <div key={field.key} className="flex items-center">
                      <FormItem
                        name={[field.name, 'lang']}
                        style={{ display: 'none' }}
                        initialValue={dataItem.trans ? dataItem.trans[index].lang : 'vi'}
                      >
                        <Input type="text" />
                      </FormItem>
                      <FormItem
                        name={[field.name, 'name']}
                        label={dataItem.trans ? dataItem.trans[index].lang : 'vi'}
                        style={{ width: '100%' }}
                        labelWidth={80}
                      >
                        <Input />
                      </FormItem>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </FormItem> */}

          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItem label="Avatar" valuePropName="fileList">
          <WikiUploadImage
            fileList={avatar ? [avatar] : []}
            onChange={file => setAvatar(file)}
            onRemoveItem={() => setAvatar(undefined)}
            limit={1}
            showUploadList
          />
        </FormItem>
        <FormItem label="Verified" valuePropName="checked">
          <Switch defaultChecked={dataItem.verified} />
        </FormItem>
        <FormItem label="Sponsored" valuePropName="checked">
          <Switch defaultChecked={dataItem.sponsored} />
        </FormItem>
        <Divider orientation="left" style={{ fontWeight: '100' }}>
          About
        </Divider>
        <div className="flex items-center gap-x-[20px]">
          <FormItem name="about" label="en" className="flex-1" labelWidth={80}>
            <TextArea rows={4} />
          </FormItem>
          <FormItem name="trans" className="flex-1" style={{ marginBottom: 0 }}>
            <Form.List name="trans" initialValue={dataItem.trans}>
              {(fields, { add }) => (
                <>
                  {fields.length === 0 && add()}
                  {fields.map((field, index) => (
                    <div key={field.key} className="flex items-center">
                      <FormItem
                        name={[field.name, 'lang']}
                        style={{ display: 'none' }}
                        initialValue={dataItem.trans ? dataItem.trans[index].lang : 'vi'}
                      >
                        <Input type="text" />
                      </FormItem>
                      <FormItem
                        name={[field.name, 'about']}
                        label={dataItem.trans ? dataItem.trans[index].lang : 'vi'}
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
        <FormItem label="Contract Address">
          <Form.List name="contract_addresses" initialValue={dataItem.contract_addresses}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <FormItem name={[field.name, 'address']}>
                      <Input placeholder="Address" />
                    </FormItem>
                    <FormItem name={[field.name, 'url']} rules={[{ type: 'url' }]}>
                      <Input placeholder="URL" />
                    </FormItem>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Address
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>
        <FormItem label="Features">
          <Form.List name="features">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <FormItem name={[field.name, 'en']}>
                      <TextArea rows={4} style={{ width: 400 }} placeholder="English" />
                    </FormItem>

                    <FormItem name={[field.name, 'vi']}>
                      <TextArea rows={4} style={{ width: 400 }} placeholder="Vietnamese" />
                    </FormItem>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Feature
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>
        <FormItemWrapper>
          <FormItem label="Crypto Currency" name="cryptocurrencies">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="select one coin"
              optionLabelProp="label"
              filterOption={(input, option) => {
                return (option!.label as string).toLowerCase().includes(input.toLowerCase());
              }}
              onSearch={value => debounceSearchCoin(value)}
            >
              {coins.map((coin: any) => {
                return (
                  <Option value={coin.id} label={coin.name}>
                    <div className="demo-option-label-item">{coin.name}</div>
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItemWrapper>
          <FormItem name="categories" label="Categories">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="select one category"
              optionLabelProp="label"
              onSearch={value => debounceSearchCategory(value)}
              filterOption={(input, option) => {
                return (option!.label as string).toLowerCase().includes(input.toLowerCase());
              }}
            >
              {categories.map((category: any) => {
                return (
                  <Option value={category.id} label={category.name ?? category.title}>
                    <div className="demo-option-label-item">{category.name ?? category.title}</div>
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItem name="apps" label="App">
          <Form.List name="apps" initialValue={dataItem.apps}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <FormItem name={[field.name, 'name']}>
                      {/* <Input placeholder="Name" /> */}
                      <Select style={{ width: '100%' }} placeholder="Select one name" optionLabelProp="label">
                        {appNameOptions.map(option => (
                          <Option value={option.value}>{option.label}</Option>
                        ))}
                      </Select>
                    </FormItem>
                    <FormItem name={[field.name, 'url']} rules={[{ type: 'url' }]}>
                      <Input placeholder="URL" />
                    </FormItem>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add App
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>
        <FormItem name="supports" label="Support">
          <Form.List name="supports" initialValue={dataItem.supports}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <FormItem name={[field.name, 'name']}>
                      <Input placeholder="Name" />
                    </FormItem>
                    <FormItem name={[field.name, 'url']} rules={[]}>
                      <Input placeholder="URL" />
                    </FormItem>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Support
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>
        <FormItem label="Gallery" valuePropName="fileList">
          <WikiUploadImage
            fileList={galleries}
            onChange={file => setGalleries((prev: any) => [...prev, file])}
            onRemoveItem={key => setGalleries((prev: any) => prev.filter((file: string) => file !== key))}
            limit={10}
            showUploadList
            multiple
          />
        </FormItem>

        <FormItemWrapper>
          <FormItem name="team" label="Team Person">
            <Form.List name="team" initialValue={dataItem.team}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(field => (
                    <>
                      <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <FormItem name={[field.name, 'name']}>
                          <Input placeholder="Name" />
                        </FormItem>
                        <FormItem name={[field.name, 'position']}>
                          <Input placeholder="Position" />
                        </FormItem>
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Space>
                      <FormItem label="Contacts">
                        <Form.List name={[field.name, 'contacts']}>
                          {(fields, { add, remove }) => {
                            return (
                              <>
                                {fields.map(field => (
                                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <FormItem name={[field.name, 'name']}>
                                      <Select
                                        style={{ width: '100%' }}
                                        placeholder="Select one type"
                                        optionLabelProp="label"
                                      >
                                        {teamNameOptions.map(option => (
                                          <Option value={option.value}>{option.label}</Option>
                                        ))}
                                      </Select>
                                    </FormItem>
                                    <FormItem name={[field.name, 'url']} rules={[{ type: 'url' }]}>
                                      <Input placeholder="URL" />
                                    </FormItem>
                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                  </Space>
                                ))}

                                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                  Add Contact
                                </Button>
                              </>
                            );
                          }}
                        </Form.List>
                      </FormItem>

                      <Divider />
                    </>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Team
                  </Button>
                </>
              )}
            </Form.List>
          </FormItem>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="parent_company" label="Parent Company" rules={[]}>
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="team_location" label="Team Location" rules={[]}>
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <SocialForm />

        <FormItem>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};

export const FormItem = styled(Form.Item)<any>`
  .ant-form-item-label label {
    width: ${({ labelWidth }) => `${labelWidth ? labelWidth : '140'}px`};
  }
  flex: 1;
`;

export const FormItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0 20px;
`;
