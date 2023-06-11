/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiGetCategoryList } from '@/api/category.api';
import { apiGetCompanyList } from '@/api/company.api';
import { apiAddEvent, apiGetEventItem, apiUpdateEvent } from '@/api/event.api';
import { apiGetPersonList } from '@/api/person.api';
import WikiUploadImage from '@/components/wikiblock/upload-image-v2';
import { Company } from '@/interface/company/company.interface';
import { Agenda, Event } from '@/interface/event.interface';
import { useLocale } from '@/locales';
import { Translation } from '@/types/common';
import { formatDataPayload, uploadImages } from '@/utils/helper';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, message, Select, Space, Switch } from 'antd';
import 'antd/dist/antd.css';
import { debounce, omit } from 'lodash';
import moment from 'moment';
import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FormItemWrapper } from '../product/detail';

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const { Option } = Select;

const DatePickerCustom = DatePicker as any;

type PickerType = 'time' | 'date';

const EVENT_CATEGORY_TYPE = 'event';
const LIMIT_UPLOAD = 6;

export const EventDetailPage: FC = () => {
  const [type, setType] = useState<PickerType>('time');

  const [dataItem, setDataItem] = useState<any>({});
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any>([]);
  const { id } = useParams();
  const [form] = Form.useForm();
  const [banners, setBanners] = useState<any>([]);
  const [media, setMedia] = useState<any>([]);
  const [people, setPeople] = useState<any>([]);
  const [companies, setCompanies] = useState<any>([]);

  const fetchItem = async (detailId: string) => {
    const { trans, ...result }: any = await apiGetEventItem(detailId);

    if (result) {
      const _trans = trans.length > 0 ? trans : [{ lang: 'vi', introduction: '', agendas: [] }];
      const vi = trans.find((item: any) => item.lang === 'vi');
      const item = {
        ...result,
        categories: result.categories.map((cat: any) => cat.id),
        speakers: result.speakers.map((speaker: any) => speaker.id),
        person_sponsors: result.person_sponsors.map((person: any) => person.id),
        company_sponsors: result.company_sponsors.map((company: any) => company.id),
        agendas: [
          ...result.agendas.map((agenda: any) => ({
            ...agenda,
            time: moment(agenda.time),
            trans: _trans.map((tran: Translation, index: number) => ({
              lang: tran.lang,
              description: tran.agendas[index],
            })),
          })),
        ],
        start_date: moment(result.start_date) || moment(),
        end_date: moment(result.end_date) || moment(),
        trans: _trans,
      };

      setDataItem(item);
      setBanners(result.banners || []);
      setMedia(result.media || []);
      form.setFieldsValue(item);

      setCompanies((prev: any) => {
        const companies = [...prev];

        result.company_sponsors.forEach((company: Company) => {
          const index = companies.findIndex((c: any) => c.id === company.id);

          index === -1 && categories.push(company);
        });

        return companies;
      });
    }
  };

  const fetchCategory = async (keyword?: string) => {
    const { data = [] }: any = await apiGetCategoryList({
      offset: 1,
      limit: 10,
      type: EVENT_CATEGORY_TYPE,
      keyword,
    });

    setCategories(data);
  };

  const fetchPeople = async (keyword?: string) => {
    const { data = [] }: any = await apiGetPersonList({
      keyword,
    });

    if (data) {
      setPeople(data);
    }
  };

  const fetchCompany = async (keyword?: string) => {
    const { data = [] }: any = await apiGetCompanyList({
      keyword,
    });

    if (data) {
      setCompanies(data);
    }
  };

  const updateItem = async (data: Partial<Event>, detailId?: string) => {
    let result: any;

    if (data.agendas && data.agendas.length > 0) {
      data = formatAgendas(data);
    }

    data = formatDataPayload(data);

    if (data.trans?.length) {
      data.trans = data.trans.map(item => formatDataPayload(item)) as any;
    }

    // check start date and end date is valid
    if (!isEndDateAfterStartDate(data.start_date, data.end_date)) {
      message.error('End date must be after start date');

      return;
    }

    // if have agenda, check agenda time is valid
    const isAgendasValid =
      !data.agendas ||
      data.agendas.every((agenda: any, index) => {
        const isValid = isAgendaTimeValid(data.start_date, data.end_date, agenda.time);

        !isValid && message.error(`Agenda ${index + 1} end time must be after start time and before event end time`);

        return isValid;
      });

    if (!isAgendasValid) {
      return;
    }

    // format value ignore value is null or undefined or empty

    if (banners.length || media.length) {
      message.loading({ content: 'Uploading...', key: 'uploading' });
    }

    const [bannersUploaded, mediaUploaded] = await Promise.all([
      uploadImages(banners, 'events'),
      uploadImages(media, 'events'),
    ]);

    if (bannersUploaded.length || mediaUploaded.length) {
      message.success({ content: 'Upload success', key: 'uploading' });
    }

    data.banners = bannersUploaded;
    data.media = media.map((_: any, index: number) => {
      return {
        type: 'image',
        url: mediaUploaded[index],
      };
    });

    if (detailId) {
      // Update
      result = await apiUpdateEvent(detailId, data);
    } else {
      // Add
      result = await apiAddEvent(data);
    }
    if (result) {
      if (detailId) {
        message.info(formatMessage({ id: 'global.tips.updateSuccess' }).replace('{0}', detailId));
        fetchItem(detailId);
      } else {
        message.info(formatMessage({ id: 'global.tips.createSuccess' }).replace('{0}', result.id));
        const path = `/event`;

        return navigate(path);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchItem(id);
    }
    // Load Category
    fetchCategory();
    // Load People
    fetchPeople();

    fetchCompany();

    // Load Exchange

    // Load Wallet

    // Load Team

    // Load Company
  }, [id]);

  const onFinish = (values: any) => {
    updateItem(values, id);
  };

  const onReset = () => {
    form.resetFields();
  };

  const disabledDate = (current: any, type: 'start_date' | 'end_date') => {
    // Can not select days before today and today
    switch (type) {
      case 'start_date':
        return current && current < moment().endOf('day');

      case 'end_date':
        const start_date = form.getFieldValue('start_date');

        return current && current < moment().endOf('day') && current < moment(start_date).endOf('day');
      default:
        break;
    }
  };

  const debounceSearchPerson = useCallback(
    debounce(value => {
      const searchValue = value.length > 0 ? value : undefined;

      fetchPeople(searchValue);
    }, 200),
    [],
  );

  const debounceSearchCategory = useCallback(
    debounce(value => {
      const searchValue = value.length > 0 ? value : undefined;

      fetchCategory(searchValue);
    }, 200),
    [],
  );

  useEffect(() => {
    console.log(companies);
  }, [companies]);

  return (
    <div className="p-3 bg-white">
      <Form form={form} name="control-hooks" onFinish={onFinish}>
        {dataItem.id && (
          <FormItemWrapper>
            <FormItem label="ID">
              <Input value={dataItem.id} disabled />
            </FormItem>
            <div className="flex-1"></div>
          </FormItemWrapper>
        )}
        <FormItemWrapper>
          <FormItem name="type" label="Type" rules={[{ required: true }]}>
            <Select placeholder="Select a option and change input text above" allowClear>
              <Option value="online">ONLINE </Option>
              <Option value="offline">OFFLINE</Option>
              <Option value="virtual">VIRTUAL</Option>
            </Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItem label="Trending" name="trending" valuePropName="checked">
          <Switch />
        </FormItem>
        <FormItem label="Significant" name="significant" valuePropName="checked">
          <Switch />
        </FormItem>
        <FormItemWrapper>
          <FormItem name="name" label="Name" rules={[{ required: true }, { whitespace: true }]}>
            <Input />
          </FormItem>
          {/* <FormItem name="trans" className="flex-1" style={{ marginBottom: 0 }}>
            <Form.List name="trans" initialValue={dataItem.trans}>
              {(fields, { add, remove }) => (
                <>
                  {fields.length === 0 && add()}
                  {fields.map((field, index) => (
                    <div key={field.key} className="flex items-center">
                      <FormItem
                        name={[field.name, 'lang']}
                        style={{ display: 'none' }}
                        initialValue={dataItem.trans ? dataItem.trans[index].lang : 'vi'}
                      >
                        <Input type="text" value={dataItem.trans ? dataItem.trans[index].lang : 'vi'} />
                      </FormItem>
                      <FormItem
                        name={[field.name, 'name']}
                        label={dataItem.trans ? dataItem.trans[index].lang : 'vi'}
                        style={{ width: '100%' }}
                        labelWidth={80}
                        rules={[{ whitespace: true, message: 'Name translate cannot be a blank character' }]}
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
        <FormItemWrapper>
          <FormItem
            name="introduction"
            label="Introduction"
            rules={[{ whitespace: true, message: 'Introduction cannot be a blank character' }]}
          >
            <Input />
          </FormItem>
          <FormItem name="trans" className="flex-1" style={{ marginBottom: 0 }}>
            <Form.List name="trans" initialValue={dataItem.trans}>
              {(fields, { add, remove }) => (
                <>
                  {fields.length === 0 && add()}
                  {fields.map((field, index) => (
                    <div key={field.key} className="flex items-center">
                      <FormItem
                        name={[field.name, 'lang']}
                        style={{ display: 'none' }}
                        initialValue={dataItem.trans ? dataItem.trans[index].lang : 'vi'}
                      >
                        <Input type="text" value={dataItem.trans ? dataItem.trans[index].lang : 'vi'} />
                      </FormItem>
                      <FormItem
                        name={[field.name, 'introduction']}
                        label={dataItem.trans ? dataItem.trans[index].lang : 'vi'}
                        style={{ width: '100%' }}
                        labelWidth={80}
                        rules={[{ whitespace: true, message: 'Introduction translate cannot be a blank character' }]}
                      >
                        <Input />
                      </FormItem>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </FormItem>
        </FormItemWrapper>
        <FormItemWrapper>
          <FormItem name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}>
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItem label="Agendas">
          <Form.List name="agendas" initialValue={dataItem.agendas}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <div key={field.key} className="flex items-center">
                    <FormItem name={[field.name, 'time']}>
                      <DatePickerCustom
                        disabledDate={(current: any) => disabledDate(current, 'start_date')}
                        showTime={{
                          defaultValue: moment('00:00:00', 'HH:mm:ss'),
                        }}
                      />
                    </FormItem>

                    <div className="flex gap-[20px] pl-[20px]" style={{ flex: 5 }}>
                      <FormItem
                        name={[field.name, 'description']}
                        rules={[
                          { whitespace: true, message: 'Description cannot be a blank character' },
                          { required: true, message: 'Description is required' },
                        ]}
                      >
                        <Input placeholder="Description" />
                      </FormItem>
                      <FormItem style={{ marginBottom: 0 }}>
                        <Form.List name={[field.name, 'trans']}>
                          {(fields, { add, remove }) => {
                            fields.length === 0 && add();

                            return (
                              <div key={field.key} className="flex items-center">
                                <FormItem name={[field.name, 'lang']} style={{ display: 'none' }} initialValue={'vi'}>
                                  <Input type="text" value={'vi'} />
                                </FormItem>
                                <FormItem
                                  name={[field.name, 'description']}
                                  label={'vi'}
                                  style={{ width: '100%' }}
                                  labelWidth={80}
                                  rules={[{ whitespace: true, message: 'Description cannot be a blank character' }]}
                                >
                                  <Input placeholder="Description translate" />
                                </FormItem>
                              </div>
                            );
                          }}
                        </Form.List>
                      </FormItem>
                    </div>
                    <MinusCircleOutlined
                      onClick={() => remove(field.name)}
                      style={{ marginBottom: 24, marginLeft: 20 }}
                    />
                  </div>
                  // </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Agendas
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>
        <FormItem name="start_date" label="Start date" rules={[{ required: true }]}>
          <DatePickerCustom showTime disabledDate={(current: any) => disabledDate(current, 'start_date')} />
        </FormItem>
        <FormItem name="end_date" label="End date" rules={[{ required: true }]}>
          <DatePickerCustom showTime disabledDate={(current: any) => disabledDate(current, 'end_date')} />
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
              onSearch={value => debounceSearchCategory(value)}
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
          <FormItem label="Speakers" name="speakers">
            <Select
              placeholder="select one speaker"
              mode="multiple"
              style={{ width: '100%' }}
              optionLabelProp="label"
              filterOption={(input, option) => {
                return (option!.label as string).toLowerCase().includes(input.toLowerCase());
              }}
              onSearch={value => debounceSearchPerson(value)}
            >
              {people.map((person: any) => (
                <Option value={person.id} label={person.name} key={person.id}>
                  {person.name}
                </Option>
              ))}
            </Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>
        {/* <FormItem label="Sponsors">
          <Form.List name="sponsors">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <FormItem {...field}>
                      <Input
                        placeholder="Owner"
                        defaultValue={dataItem.sponsors && dataItem.sponsors[index] ? dataItem?.sponsors[index] : ''}
                      />
                    </FormItem>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Sponsors
                </Button>
              </>
            )}
          </Form.List>
        </FormItem> */}
        <FormItemWrapper>
          <FormItem label="Person Sponsors" name="person_sponsors">
            <Select
              placeholder="select one person"
              mode="multiple"
              style={{ width: '100%' }}
              optionLabelProp="label"
              filterOption={(input, option) => {
                return (option!.label as string).toLowerCase().includes(input.toLowerCase());
              }}
              onSearch={value => debounceSearchPerson(value)}
            >
              {people.map((person: any) => (
                <Option value={person.id} label={person.name} key={person.id}>
                  {person.name}
                </Option>
              ))}
            </Select>
          </FormItem>

          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem label="Company Sponsors" name="company_sponsors">
            <Select
              placeholder="select one company"
              mode="multiple"
              style={{ width: '100%' }}
              optionLabelProp="label"
              filterOption={(input, option) => {
                return (option!.label as string).toLowerCase().includes(input.toLowerCase());
              }}
              onSearch={value => debounceSearchPerson(value)}
            >
              {companies.map((company: any) => (
                <Option value={company.id} label={company.name} key={company.id}>
                  {company.name}
                </Option>
              ))}
            </Select>
          </FormItem>

          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItem label="Subscribers">
          <Form.List name="subscribers">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <FormItem {...field} rules={[{ type: 'email', message: 'Subscriber must is a valid email' }]}>
                      <Input
                        placeholder="Subscriber"
                        // defaultValue={
                        //   dataItem.subscribers && dataItem.subscribers[index] ? dataItem?.subscribers[index] : ''
                        // }
                      />
                    </FormItem>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Subscribers
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>
        <FormItem label="Banners">
          <WikiUploadImage
            fileList={banners}
            multiple
            showUploadList
            onRemoveItem={key => setBanners((prev: any) => prev.filter((banner: string) => banner !== key))}
            onChange={file => setBanners((prev: any) => [...prev, file])}
            limit={LIMIT_UPLOAD}
          />
        </FormItem>
        <FormItem label="Media">
          <WikiUploadImage
            fileList={media}
            multiple
            showUploadList
            onRemoveItem={key => setMedia((prev: any) => prev.filter((img: string) => img !== key))}
            onChange={file => setMedia((prev: any) => [...prev, file])}
            limit={LIMIT_UPLOAD}
          />
        </FormItem>
        <FormItemWrapper>
          <FormItem name="tel" label=" Tel" rules={[{ whitespace: true, message: 'Tel cannot be a blank character' }]}>
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItemWrapper>
          <FormItem
            name="website"
            label=" Website"
            rules={[{ whitespace: true, message: 'Website cannot be a blank character' }, { type: 'url' }]}
          >
            <Input />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItem {...tailLayout}>
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

const isEndDateAfterStartDate = (start_date: any, end_date: any) => {
  return Date.parse(start_date) <= Date.parse(end_date);
};

const isAgendaTimeValid = (start_date: any, end_date: any, agendaTime: any) => {
  return Date.parse(start_date) <= Date.parse(agendaTime) && Date.parse(agendaTime) <= Date.parse(end_date);
};

const formatAgendas = (obj: any) => {
  const { agendas = [], trans = [] } = obj;

  const agendasTrans: any[] = [];

  agendas.forEach((_agenda: Agenda) => {
    const { trans = [] } = _agenda;

    trans.forEach(tran => {
      agendasTrans.push({
        [tran.lang]: tran.description,
      });
    });
  });

  const _trans = trans?.map((tran: Translation) => {
    const agendaTrans = agendasTrans.find((item: any) => item[tran.lang]);

    return {
      ...tran,
      agendas: Object.values(agendaTrans || {}),
    };
  });

  obj.agendas = obj.agendas.map((item: Agenda) => omit(item, 'trans'));
  obj.trans = _trans;

  return obj;
};

const FormItem = styled(Form.Item)<any>`
  .ant-form-item-label label {
    width: ${({ labelWidth }) => `${labelWidth ? labelWidth : '140'}px`};
  }
  flex: 1;
`;
