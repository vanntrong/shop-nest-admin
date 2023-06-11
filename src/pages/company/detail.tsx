import { apiGetCategoryList } from '@/api/category.api';
import { apiGetCoinList } from '@/api/coin.api';
import { apiAddCompany, apiGetCompanyItem, apiUpdateCompany } from '@/api/company.api';
import { apiGetProductList } from '@/api/product.api';
import SocialForm from '@/components/wikiblock/social-form';
import WikiUploadImage from '@/components/wikiblock/upload-image-v2';
import { Category } from '@/interface/category/category.interface';
import { Coin } from '@/interface/coin/coin.interface';
import { Company } from '@/interface/company/company.interface';
import { Product } from '@/interface/product/product.interface';
import { useLocale } from '@/locales';
import { formatDataPayload, formatTrans, uploadImages } from '@/utils/helper';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, message, Select, Space, Switch } from 'antd';
import 'antd/dist/antd.css';
import { debounce } from 'lodash';
import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const { Option } = Select;
const { TextArea } = Input;

export const CompanyDetailPage: FC = () => {
  const [dataItem, setDataItem] = useState<any>({});
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [coins, setCoins] = useState<any>([]);
  const { id } = useParams();
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState<string>();

  const fetchCategory = async (searchValue?: string) => {
    const { data = [] }: any = await apiGetCategoryList({
      keyword: searchValue,
    });

    if (data) {
      setCategories(data);
    }
  };

  const fetchProduct = async (searchValue?: string) => {
    const { data = [] }: any = await apiGetProductList({
      keyword: searchValue,
    });

    if (data) {
      setProducts(data);
    }
  };

  const fetchCoins = async (searchValue?: string) => {
    const { data = [] }: any = await apiGetCoinList({
      keyword: searchValue,
    });

    if (data) {
      setCoins(data);
    }
  };
  const fetchItem = async (detailId: string) => {
    const { trans, ...result }: any = await apiGetCompanyItem(detailId);

    if (result) {
      // Fetch Vietnamese
      const _trans = trans.length > 0 ? trans : [{ lang: 'vi', about: '', short_description: '' }];
      const vi = _trans.find((i: any) => i.lang === 'vi');
      const servicesVi = vi.services || [];
      const item = {
        ...result,
        services: result.services.map((service: string, index: number) => ({
          en: service,
          vi: servicesVi[index] || '',
        })),
        categories: result.categories?.map((cat: any) => cat.id),
        products: result.products?.map((pro: any) => pro.id),
        cryptocurrencies: result.cryptocurrencies?.map((coin: any) => coin.id),
        trans: _trans,
      };

      form.setFieldsValue(item);
      setDataItem(item);
      setAvatar(result.avatar);

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

      setProducts((prev: any) => {
        const products = [...prev];

        result.products.forEach((prod: Product) => {
          const index = products.findIndex((c: any) => c.id === prod.id);

          index === -1 && products.push(prod);
        });

        return products;
      });
    }
  };

  const updateItem = async (data: Company, detailId?: string) => {
    let result: any;

    data = formatTrans(data, 'services');
    data = formatDataPayload(data) as Company;

    if (data.trans?.length) {
      data.trans = data.trans.map(item => formatDataPayload(item)) as any;
    }

    if (avatar) {
      message.loading({ content: 'Uploading image...', key: 'uploading' });
      const [image] = await uploadImages([avatar], 'companies');

      data.avatar = image;

      message.success({ content: 'Upload image success', key: 'uploading' });
    }

    if (detailId) {
      // Update
      result = await apiUpdateCompany(detailId, data);
    } else {
      // Add
      result = await apiAddCompany(data);
    }
    if (result) {
      if (detailId) {
        message.info(formatMessage({ id: 'global.tips.updateSuccess' }).replace('{0}', detailId));
        fetchItem(detailId);
      } else {
        message.info(formatMessage({ id: 'global.tips.createSuccess' }).replace('{0}', result.id));
        const path = `/company`;

        return navigate(path);
      }
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchProduct();
    fetchCoins();
    if (id) {
      fetchItem(id);
    }
  }, [id]);

  const onFinish = (values: any) => {
    updateItem(values, id);
  };

  // const onReset = () => {
  //   form.resetFields();
  // };
  // const onFill = () => {
  //   form.setFieldsValue({
  //     note: 'Hello world!',
  //     gender: 'male',
  //   });
  // };

  const handleAvatarChange = (file: any) => setAvatar(file);

  const debounceSearchCategory = useCallback(
    debounce((value: string) => {
      const searchValue = value.length > 0 ? value : undefined;

      fetchCategory(searchValue);
    }, 200),
    [],
  );

  const debounceSearchProduct = useCallback(
    debounce((value: string) => {
      const searchValue = value.length > 0 ? value : undefined;

      fetchProduct(searchValue);
    }, 200),
    [],
  );

  const debounceSearchCoins = useCallback(
    debounce((value: string) => {
      const searchValue = value.length > 0 ? value : undefined;

      fetchCoins(searchValue);
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
        <FormItem label="Verified" valuePropName="checked">
          <Switch />
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
                        initialValue={dataItem?.trans ? dataItem?.trans[index].lang : 'vi'}
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
        <FormItemWrapper>
          <FormItem name="headquarter" label=" Headquarter">
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItem label="Avatar">
          <WikiUploadImage
            fileList={avatar ? [avatar] : []}
            onChange={handleAvatarChange}
            onRemoveItem={() => setAvatar(undefined)}
            showUploadList
            limit={1}
          />
        </FormItem>

        <SocialForm />

        {/* <FormItemWrapper>
          <FormItem name="reddit" label="Reddit" rules={[{ type: 'url' }]}>
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper> */}
        <FormItemWrapper>
          <FormItem name="explorer" label="Explorer" rules={[{ type: 'url' }]}>
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        {/* <FormItemWrapper>
          <FormItem name="whitepaper" label="Whitepaper" rules={[{ type: 'url' }]}>
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper> */}
        <Divider orientation="left" style={{ fontWeight: '100' }}>
          Short description
        </Divider>
        <div className="flex items-center gap-x-[20px]">
          <FormItem name="short_description" label="en" className="flex-1" labelWidth={80}>
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
                        initialValue={dataItem?.trans ? dataItem?.trans[index].lang : 'vi'}
                      >
                        <Input type="text" />
                      </FormItem>
                      <FormItem
                        name={[field.name, 'short_description']}
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
        <FormItemWrapper>
          <FormItem name="location" label="Location" rules={[{ required: true }]}>
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItemWrapper>
          <FormItem label="Services">
            <Form.List name="services">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(field => (
                    <>
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
                    </>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Services
                  </Button>
                </>
              )}
            </Form.List>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItem label="Supports">
          <Form.List name="supports" initialValue={dataItem.supports}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <FormItem name={[field.name, 'name']}>
                      <Input placeholder="Name" />
                    </FormItem>
                    <FormItem name={[field.name, 'url']}>
                      <Input placeholder="URL" />
                    </FormItem>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Supports
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>
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
              {categories?.map((category: any) => {
                return (
                  <Option value={category.id} label={category.title}>
                    {category.title}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItemWrapper>
          <FormItem name="products" label="Products">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="select one Product"
              optionLabelProp="label"
              onSearch={value => debounceSearchProduct(value)}
              filterOption={(input, option) => {
                return (option!.label as string).toLowerCase().includes(input.toLowerCase());
              }}
            >
              {products?.map((product: any) => {
                return (
                  <Option value={product.id} label={product.name}>
                    <div className="demo-option-label-item">{product.name}</div>
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItem label="Research Papers">
          <Form.List name="research_papers" initialValue={dataItem.research_papers}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <FormItem name={[field.name, 'title']}>
                      <Input placeholder="Name" />
                    </FormItem>
                    <FormItem name={[field.name, 'url']}>
                      <Input placeholder="Url" />
                    </FormItem>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Research Papers
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
                    <FormItem name={[field.name, 'name']}>
                      <Input placeholder="Name" />
                    </FormItem>
                    <FormItem name={[field.name, 'position']}>
                      <Input placeholder="Position" />
                    </FormItem>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Team
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>
        <FormItemWrapper>
          <FormItem name="cryptocurrencies" label="Cryptocurrencies">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="select one cryptocurrencies"
              optionLabelProp="label"
              onSearch={value => debounceSearchCoins(value)}
              filterOption={(input, option) => {
                return (option!.label as string).toLowerCase().includes(input.toLowerCase());
              }}
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
        <FormItem label="Clients">
          <Form.List name="clients">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <FormItem {...field}>
                      <Input
                        placeholder="Owner"
                        defaultValue={dataItem.clients && dataItem.clients[index] ? dataItem?.clients[index] : ''}
                      />
                    </FormItem>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Clients
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>
        <FormItem label="Portfolios">
          <Form.List name="portfolios">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <FormItem {...field}>
                      <Input
                        placeholder="Owner"
                        defaultValue={
                          dataItem.portfolios && dataItem.portfolios[index] ? dataItem?.portfolios[index] : ''
                        }
                      />
                    </FormItem>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Portfolios
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>

        <FormItemWrapper>
          <FormItem label="Recent Twitter" name="recent_twitter" rules={[{ type: 'url' }]}>
            <Input placeholder="Recent Twitter" />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItem>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          {/* <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
          <Button type="link" htmlType="button" onClick={onFill}>
            Fill form
          </Button> */}
        </FormItem>
      </Form>
    </div>
  );
};

const FormItem = styled(Form.Item)<any>`
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
