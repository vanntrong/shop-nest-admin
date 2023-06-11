import { apiGetCategoryList } from '@/api/category.api';
import { apiAddPerson, apiGetPersonItem, apiUpdatePerson } from '@/api/person.api';
import SocialForm from '@/components/wikiblock/social-form';
import WikiUploadImage from '@/components/wikiblock/upload-image-v2';
import { Category } from '@/interface/category/category.interface';
import { Person } from '@/interface/person/person.interface';
import { useLocale } from '@/locales';
import { FormItemWrapper } from '@/pages/product/detail';
import { formatDataPayload, uploadImages } from '@/utils/helper';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, message, Select, Space, Switch } from 'antd';
import 'antd/dist/antd.css';
import { debounce } from 'lodash';
import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const { TextArea } = Input;
const { Option } = Select;

export const PersonDetailPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any>([]);
  const [dataItem, setDataItem] = useState<any>({});
  const { id } = useParams();
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState<string>();

  const fetchCategory = async (keyword?: string) => {
    const allCategory: any = await apiGetCategoryList({
      keyword,
    });

    if (allCategory.items && keyword) {
      setCategories(allCategory.items);
    }
    if (allCategory.items && !keyword) {
      setCategories((prev: any) => [...prev, ...allCategory.items]);
    }
  };
  const fetchItem = async (detailId: string) => {
    const { trans, ...result }: any = await apiGetPersonItem(detailId);

    if (result) {
      const _trans = trans.length > 0 ? trans : [{ lang: 'vi', about: '', short_description: '' }];
      const item = {
        ...result,
        categories: result.categories.map((item: any) => item.id),
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
  const updateItem = async (data: Person, detailId?: string) => {
    let result: any;

    data = formatDataPayload(data) as Person;

    if (data.trans?.length) {
      data.trans = data.trans.map(item => formatDataPayload(item)) as any;
    }

    if (avatar) {
      message.loading({ content: 'Uploading...', key: 'uploading' });
      data.avatar = (await uploadImages([avatar], 'persons'))[0];

      message.success({ content: 'Uploaded', key: 'uploading' });
    }

    if (detailId) {
      // Update
      result = await apiUpdatePerson(detailId, data);
    } else {
      // Add
      result = await apiAddPerson(data);
    }
    if (result) {
      if (detailId) {
        message.info(formatMessage({ id: 'global.tips.updateSuccess' }).replace('{0}', detailId));
        fetchItem(detailId);
      } else {
        message.info(formatMessage({ id: 'global.tips.createSuccess' }).replace('{0}', result.id));
        const path = `/person`;

        return navigate(path);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchItem(id);
    }
    fetchCategory();
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

  const debounceSearchCategory = useCallback(
    debounce(value => {
      const searchValue = value.length > 0 ? value : undefined;

      fetchCategory(searchValue);
    }, 200),
    [],
  );

  return (
    <div className="p-3 bg-white">
      <Form form={form} name="control-hooks" onFinish={onFinish}>
        {/* <FormItem name="id" label="ID">
          <Input />
        </FormItem> */}
        <FormItemWrapper>
          <FormItem name="name" label="Name" rules={[{ required: true }]}>
            <Input defaultValue={dataItem.name} />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItem name="verified" label="Verified" valuePropName="checked">
          <Switch />
        </FormItem>
        <Divider orientation="left" style={{ fontWeight: '100' }}>
          Description
        </Divider>
        <div className="flex items-center gap-x-[20px]">
          <FormItem name="description" label="en" rules={[]} className="flex-1" labelWidth={80}>
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
                        name={[field.name, 'description']}
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
        <FormItem label="Avatar">
          <WikiUploadImage
            fileList={avatar ? [avatar] : []}
            onChange={file => setAvatar(file)}
            onRemoveItem={() => setAvatar(undefined)}
            showUploadList
            limit={1}
          />
        </FormItem>
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
                        initialValue={dataItem.trans ? dataItem.trans[index].lang : 'vi'}
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

        <SocialForm />

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
        <FormItem label="Educations">
          <Form.List name="educations">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <FormItem {...field}>
                      <Input
                        placeholder="Education"
                        defaultValue={
                          dataItem.educations && dataItem.educations[index] ? dataItem?.educations[index] : ''
                        }
                      />
                    </FormItem>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Educations
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>
        <FormItem label="Works">
          <Form.List name="works" initialValue={dataItem.works}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <FormItem name={[field.name, 'company']}>
                      <Input placeholder="Company" />
                    </FormItem>
                    <FormItem name={[field.name, 'position']}>
                      <Input placeholder="Position" />
                    </FormItem>
                    <FormItem name={[field.name, 'type']}>
                      <Input placeholder="Type" />
                    </FormItem>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Work
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>
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
