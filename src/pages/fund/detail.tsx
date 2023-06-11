import { apiGetCategoryList } from '@/api/category.api';
import { apiGetCoinList } from '@/api/coin.api';
import { apiGetCompanyList } from '@/api/company.api';
import { apiAddFundItem, apiGetFundItem, apiUpdateFundItem } from '@/api/fund.api';
import { apiGetPersonList } from '@/api/person.api';
import SocialForm from '@/components/wikiblock/social-form';
import WikiUploadImage from '@/components/wikiblock/upload-image-v2';
import { Coin } from '@/interface/coin/coin.interface';
import { Company } from '@/interface/company/company.interface';
// import { getWikiUploadImage, WikiUploadImage } from '@/components/wikiblock/upload-image';
import { Fund, FUND_TYPE } from '@/interface/fund/fund.interface';
import { Person } from '@/interface/person/person.interface';
import { useLocale } from '@/locales';
import { formatDataPayload, uploadImages } from '@/utils/helper';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, message, Select, Space, Switch } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FormItemWrapper } from '../product/detail';

const { Option } = Select;

const FundDetailPage = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const { id } = useParams();
  const [fund, setFund] = useState<Fund>();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<any>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [avatar, setAvatar] = useState<string>();

  const fetchCategories = async (search?: string) => {
    const allCategory: any = await apiGetCategoryList({
      keyword: search,
    });

    if (allCategory.data) {
      setCategories(allCategory.data);
    }
  };

  const fetchCoins = async (search?: string) => {
    const allCoins: any = await apiGetCoinList({
      keyword: search,
    });

    if (allCoins.data) {
      setCoins(allCoins.data);
    }
  };

  const fetchCompanies = async (search?: string) => {
    const allCompanies: any = await apiGetCompanyList({
      keyword: search,
    });

    if (allCompanies.data) {
      setCompanies(allCompanies.data);
    }
  };

  const fetchPeople = async (search?: string) => {
    const allPeople: any = await apiGetPersonList({
      keyword: search,
    });

    if (allPeople.data) {
      setPeople(allPeople.data);
    }
  };

  const fetchFund = async (id: string) => {
    const res: any = await apiGetFundItem(id);

    if (res) {
      const resVi: any = await apiGetFundItem(id, 'vi');
      const trans = [{ lang: 'vi', about: resVi.about || '' }];
      const item = {
        ...res,
        categories: res.categories.map((cat: any) => cat.id),
        partners: res.partners.map((partner: any) => (typeof partner !== 'string' ? partner : { name: partner })),
        firms: res.firms.map((firm: any) => (typeof firm !== 'string' ? firm : { name: firm })),
        trans,
      };

      setAvatar(res.avatar);

      form.setFieldsValue(item);
      setFund(item);
    }
  };

  const updateFund = async (id: string, data: Fund) => {
    return await apiUpdateFundItem(id, data);
  };

  const addFund = async (data: Fund) => {
    return await apiAddFundItem(data);
  };

  useEffect(() => {
    // setLoading(true);
    fetchCategories();
    fetchCoins();
    fetchCompanies();
    fetchPeople();

    if (id) {
      fetchFund(id);
    }
  }, [id]);

  const onFinish = async (values: any) => {
    let result: any;

    if (avatar) {
      message.loading({ content: 'Uploading...', key: 'upload' });
      values.avatar = (await uploadImages([avatar]))[0];

      message.success({ content: 'Uploaded', key: 'upload' });
    }

    values = formatDataPayload(values);

    if (values.trans?.length) {
      values.trans = values.trans.map((item: any) => formatDataPayload(item)) as any;
    }

    if (id) {
      result = await updateFund(id, values);
    } else {
      result = await addFund(values);
    }

    if (result && !result.error) {
      if (id) {
        message.info(formatMessage({ id: 'global.tips.updateSuccess' }).replace('{0}', id));
        fetchFund(id);
      } else {
        message.info(formatMessage({ id: 'global.tips.createSuccess' }).replace('{0}', result.id));
        const path = `/funds`;

        return navigate(path);
      }
    }
  };

  const debounceSearchCategories = useCallback(
    debounce(value => {
      const searchValue = value.length > 0 ? value : undefined;

      fetchCategories(searchValue);
    }, 200),
    [],
  );

  const debounceSearchCoins = useCallback(
    debounce(value => {
      const searchValue = value.length > 0 ? value : undefined;

      fetchCoins(searchValue);
    }, 200),
    [],
  );

  const debounceSearchCompanies = useCallback(
    debounce(value => {
      const searchValue = value.length > 0 ? value : undefined;

      fetchCompanies(searchValue);
    }, 200),
    [],
  );

  const debounceSearchPeople = useCallback(
    debounce(value => {
      const searchValue = value.length > 0 ? value : undefined;

      fetchPeople(searchValue);
    }, 200),
    [],
  );

  return (
    <div className="p-3 bg-white">
      <Form form={form} className="control-hooks" onFinish={onFinish}>
        {fund?.id && (
          <FormItem label="ID">
            <Input value={fund?.id} disabled />
          </FormItem>
        )}
        <FormItemWrapper>
          <FormItem label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem label="Sponsored" name="sponsored" valuePropName="checked">
            <Switch />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItem name="avatars" label="Avatar">
          <WikiUploadImage
            showUploadList
            fileList={avatar ? [avatar] : []}
            multiple
            onChange={file => setAvatar(file)}
            onRemoveItem={() => setAvatar(undefined)}
            limit={1}
          />
        </FormItem>
        {/* <FormItem label="Need Review" valuePropName="checked" name="need_review">
          <Switch />
        </FormItem>
        <FormItem label="Reviewed" valuePropName="checked" name="reviewed">
          <Switch />
        </FormItem> */}
        <Divider orientation="left" style={{ fontWeight: '100' }}>
          About
        </Divider>
        <div className="flex items-center gap-x-[20px]">
          <FormItem name="about" label="en" rules={[{ required: true }]} className="flex-1" labelWidth={80}>
            <TextArea rows={4} />
          </FormItem>
          <FormItem name="trans" className="flex-1" style={{ marginBottom: 0 }}>
            <Form.List name="trans" initialValue={fund?.trans || []}>
              {(fields, { add }) => (
                <>
                  {fields.length === 0 && add()}
                  {fields.map((field, index) => (
                    <div key={field.key} className="flex items-center">
                      <FormItem
                        name={[field.name, 'lang']}
                        style={{ display: 'none' }}
                        initialValue={fund?.trans ? fund.trans[index].lang : 'vi'}
                      >
                        <Input type="text" value={fund?.trans ? fund.trans[index].lang : 'vi'} />
                      </FormItem>
                      <FormItem
                        name={[field.name, 'about']}
                        label={fund?.trans ? fund.trans[index].lang : 'vi'}
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

        <Divider orientation="left" style={{ fontWeight: '100' }}>
          Short Description
        </Divider>
        <div className="flex items-center gap-x-[20px]">
          <FormItem name="short_description" label="en" rules={[{ required: true }]} className="flex-1" labelWidth={80}>
            <TextArea rows={4} />
          </FormItem>
          <FormItem name="trans" className="flex-1" style={{ marginBottom: 0 }}>
            <Form.List name="trans" initialValue={fund?.trans || []}>
              {(fields, { add }) => (
                <>
                  {fields.length === 0 && add()}
                  {fields.map((field, index) => (
                    <div key={field.key} className="flex items-center">
                      <FormItem
                        name={[field.name, 'lang']}
                        style={{ display: 'none' }}
                        initialValue={fund?.trans ? fund.trans[index].lang : 'vi'}
                      >
                        <Input type="text" value={fund?.trans ? fund.trans[index].lang : 'vi'} />
                      </FormItem>
                      <FormItem
                        name={[field.name, 'short_description']}
                        label={fund?.trans ? fund.trans[index].lang : 'vi'}
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

        <FormItem label="Posts" name="posts">
          <Form.List name="posts" initialValue={fund?.posts}>
            {(fields, { add, remove }) => (
              <>
                {fields.length === 0 && add()}
                {fields.map(field => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <FormItem name={field.name}>
                      <Input placeholder="Url" style={{ minWidth: '120px' }} />
                    </FormItem>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Post
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
              filterOption={(input, option) => {
                return (option!.label as string).toLowerCase().includes(input.toLowerCase());
              }}
              onSearch={value => debounceSearchCategories(value)}
            >
              {categories.map((category: any) => {
                return (
                  <Option value={category.id} label={category.name} key={category.id}>
                    <div className="demo-option-label-item">{category.name}</div>
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="cryptocurrencies" label="Cryptocurrencies">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="select one cryptocurrencies"
              optionLabelProp="label"
              filterOption={(input, option) => {
                return (option!.label as string).toLowerCase().includes(input.toLowerCase());
              }}
              onSearch={value => debounceSearchCoins(value)}
            >
              {coins.map((coin: Coin) => {
                return (
                  <Option value={coin.id} label={coin.name} key={coin.id}>
                    <div className="demo-option-label-item">{coin.name}</div>
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="company_investors" label="Company Investors">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="select one company"
              optionLabelProp="label"
              filterOption={(input, option) => {
                return (option!.label as string).toLowerCase().includes(input.toLowerCase());
              }}
              onSearch={value => debounceSearchCompanies(value)}
            >
              {companies.map((company: Company) => {
                return (
                  <Option value={company.id} label={company.name} key={company.id}>
                    <div className="demo-option-label-item">{company.name}</div>
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="person_investors" label="Person Investors">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="select one person"
              optionLabelProp="label"
              filterOption={(input, option) => {
                return (option!.label as string).toLowerCase().includes(input.toLowerCase());
              }}
              onSearch={value => debounceSearchPeople(value)}
            >
              {people.map((person: Person) => {
                return (
                  <Option value={person.id} label={person.name} key={person.id}>
                    <div className="demo-option-label-item">{person.name}</div>
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="portfolio_funds" label="Portfolio Funds">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="select one fund"
              optionLabelProp="label"
              filterOption={(input, option) => {
                return (option!.label as string).toLowerCase().includes(input.toLowerCase());
              }}
              onSearch={value => debounceSearchCoins(value)}
            >
              {coins.map((coin: Coin) => {
                return (
                  <Option value={coin.id} label={coin.name} key={coin.id}>
                    <div className="demo-option-label-item">{coin.name}</div>
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="portfolio_companies" label="Portfolio Companies">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="select one company"
              optionLabelProp="label"
              filterOption={(input, option) => {
                return (option!.label as string).toLowerCase().includes(input.toLowerCase());
              }}
              onSearch={value => debounceSearchCoins(value)}
            >
              {coins.map((coin: Coin) => {
                return (
                  <Option value={coin.id} label={coin.name} key={coin.id}>
                    <div className="demo-option-label-item">{coin.name}</div>
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItem label="Fundraising Rounds" name="fundraising_rounds">
          <Form.List name="fundraising_rounds" initialValue={fund?.fundraising_rounds}>
            {(fields, { add, remove }) => (
              <>
                {fields.length === 0 && add()}
                {fields.map(field => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    {/* <FormItem name={[field.name, 'round_id']}>
                        <Input placeholder="Round Id" />
                      </FormItem> */}
                    <FormItem name={[field.name, 'round_name']}>
                      <Input placeholder="Round Name" />
                    </FormItem>
                    <FormItem name={[field.name, 'stage']}>
                      <Input placeholder="Round Stage" />
                    </FormItem>
                    <FormItem name={[field.name, 'amount']}>
                      <Input placeholder="Amount" type="number" />
                    </FormItem>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Fundraising Rounds
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>

        <FormItem label="Partners" name="partners">
          <Form.List name="partners" initialValue={fund?.partners}>
            {(fields, { add, remove }) => (
              <>
                {fields.length === 0 && add()}
                {fields.map(field => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <FormItem name={[field.name, 'foreign_id']}>
                      <Input placeholder="Partner Id" />
                    </FormItem>
                    <FormItem name={[field.name, 'name']}>
                      <Input placeholder="Partner Name" />
                    </FormItem>

                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Partners
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>

        <FormItem label="Firms" name="firms">
          <Form.List name="firms" initialValue={fund?.firms}>
            {(fields, { add, remove }) => (
              <>
                {fields.length === 0 && add()}
                {fields.map(field => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <FormItem name={[field.name, 'foreign_id']}>
                      <Input placeholder="Firm Id" />
                    </FormItem>
                    <FormItem name={[field.name, 'name']}>
                      <Input placeholder="Firm Name" />
                    </FormItem>

                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Firms
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>

        <FormItem label="Investments" name="investments">
          <Form.List name="investments" initialValue={fund?.investments}>
            {(fields, { add, remove }) => (
              <>
                {fields.length === 0 && add()}
                {fields.map(field => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    {/* <FormItem name={[field.name, 'foreign_id']}>
                        <Input placeholder="Investment Id" />
                      </FormItem> */}
                    <FormItem name={[field.name, 'name']}>
                      <Input placeholder="Investment Name" />
                    </FormItem>
                    <FormItem name={[field.name, 'type']}>
                      <Input placeholder="Investment Type" />
                    </FormItem>

                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Investments
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>

        <FormItemWrapper>
          <FormItem name="total_amount" label="Total Amount">
            <Input type="number" min={0} placeholder="Total Amount" />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="type" label="Type">
            <Select>
              {Object.values(FUND_TYPE).map((type: string) => (
                <Option value={type} key={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="funding" label="Funding">
            <Input type="number" min={0} placeholder="Funding" />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="current_roi" label="Current Roi">
            <Input type="number" min={0} placeholder="Current Roi" />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="ath_roi" label="Ath Roi">
            <Input type="number" min={0} placeholder="Ath Roi" />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="typical_project" label="Typical Project">
            <Input placeholder="Typical Project" />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="typical_category" label="Typical Category">
            <Input placeholder="Typical Category" />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="tier" label="Tier">
            <Input type="number" min={0} placeholder="Tier" />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="rating" label="Rating">
            <Input type="number" min={0} placeholder="Rating" />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="assets_allocation" label="Assets Allocation">
            <Input placeholder="Assets Allocation" />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem name="location" label="Location">
            <Input placeholder="Location" />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          {/* <FormItem name="supports" label="supports">
            <Input placeholder="supports" />
          </FormItem> */}
          <div className="flex-1"></div>
        </FormItemWrapper>

        {/* <SocialForm /> */}

        <FormItem>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};

export default FundDetailPage;

const FormItem = styled(Form.Item)<any>`
  .ant-form-item-label label {
    width: ${({ labelWidth }) => `${labelWidth ? labelWidth : '140'}px`};
  }
  flex: 1;
`;
