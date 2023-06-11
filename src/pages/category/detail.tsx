import { apiAddCategory, apiGetCategoryItem, apiUpdateCategory } from '@/api/category.api';
import { handleChange } from '@/components/editor/editor.event';
import { CATEGORY_TYPE } from '@/interface';
import { useLocale } from '@/locales';
import { formatDataPayload } from '@/utils/helper';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, InputNumber, message, Select } from 'antd';
import 'antd/dist/antd.css';
import { pick } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const { TextArea } = Input;

const FIELD_CATEGORY_PICK = ['title', 'weight', 'type', 'trans', 'sub_categories'];

const formatData = (data: any) => {
  const { sub_categories, ...rest } = pick(data, FIELD_CATEGORY_PICK);

  if (!sub_categories) {
    return rest;
  }

  return {
    ...rest,
    sub_categories: sub_categories.map((item: any) => formatData(item)),
  };
};

export const CategoryDetailPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const [dataItem, setDataItem] = useState<any>({});
  const { id } = useParams();
  const [form] = Form.useForm();
  const [subCategories, setSubCategories] = useState<any[]>([]);

  const fetchItem = async (detailId: string) => {
    const { trans, ...result }: any = await apiGetCategoryItem(detailId);

    if (result) {
      // Fetch Vietnamese
      const _trans = trans?.length > 0 ? trans : [{ lang: 'vi', title: '' }];
      const categories = await Promise.all(result.sub_categories.map((item: any) => apiGetCategoryItem(item.id)));

      const item = {
        ...result,
        sub_categories: categories || [],
        trans: _trans,
      };

      form.setFieldsValue(item);
      setDataItem(item);

      setSubCategories(item.sub_categories);
    }
  };

  const updateItem = async (data: any, detailId?: string) => {
    let result: any;

    data = formatData(data);

    data = formatDataPayload(data) as any;

    if (data.trans?.length) {
      data.trans = data.trans.map((item: any) => formatDataPayload(item)) as any;
    }

    if (detailId) {
      // Update
      result = await apiUpdateCategory(detailId, data);
    } else {
      // Add
      result = await apiAddCategory(data);
    }
    if (result) {
      if (detailId) {
        message.info(formatMessage({ id: 'global.tips.updateSuccess' }).replace('{0}', detailId));
        fetchItem(detailId);
      } else {
        message.info(formatMessage({ id: 'global.tips.createSuccess' }).replace('{0}', result.id));
        const path = `/category`;

        navigate(path);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchItem(id);
    } else {
      // fetchCategories(1);
    }
  }, [id]);

  const onFinish = (values: any) => {
    updateItem(values, id);
  };

  return (
    <div className="p-3 bg-white">
      <Form form={form} name="control-hooks" onFinish={onFinish}>
        <Divider orientation="left" style={{ fontWeight: '100' }}>
          Title
        </Divider>
        <div className="flex items-center gap-x-[20px]">
          <FormItem name="title" label="en" className="flex-1" labelWidth={80}>
            <TextArea rows={4} />
          </FormItem>
          <FormItem name="trans" className="flex-1" style={{ marginBottom: 0 }}>
            <Form.List name="trans" initialValue={dataItem.trans || []}>
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
                        name={[field.name, 'title']}
                        label={dataItem.trans ? dataItem.trans[index].lang : 'vi'}
                        style={{ width: '100%' }}
                        labelWidth={70}
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
          <FormItem name="type" label="Type">
            <Select
              style={{ width: '100%' }}
              placeholder="select one Type"
              onChange={handleChange}
              optionLabelProp="label"
              options={Object.keys(CATEGORY_TYPE).map((key: string) => ({
                text: key.replace(/_/g, ' '),
                value: CATEGORY_TYPE[key as keyof typeof CATEGORY_TYPE],
              }))}
            ></Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItem name="weight" label="Weight" rules={[{ required: true }]}>
          <InputNumber min={0} placeholder="Weight" />
        </FormItem>

        <FormItem label="Sub Categories">
          <Form.List name="sub_categories">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => {
                  return (
                    <>
                      <div key={field.key}>
                        <div className="flex items-center gap-x-[20px]">
                          <FormItem name={[field.name, 'title']} label="en" className="flex-1" labelWidth={80}>
                            <TextArea rows={4} />
                          </FormItem>
                          <FormItem className="flex-1" style={{ marginBottom: 0 }}>
                            <Form.List name={[field.name, 'trans']} initialValue={subCategories[index]?.trans}>
                              {(fields, { add }) => {
                                const trans = subCategories[index]?.trans[index]?.lang || 'vi';

                                return (
                                  <>
                                    {fields.length === 0 && add()}
                                    {fields.map(field => (
                                      <div key={field.key} className="flex items-center">
                                        <FormItem
                                          name={[field.name, 'lang']}
                                          style={{ display: 'none' }}
                                          initialValue={trans}
                                        >
                                          <Input type="text" />
                                        </FormItem>
                                        <FormItem
                                          name={[field.name, 'title']}
                                          label={trans}
                                          style={{ width: '100%' }}
                                          labelWidth={70}
                                        >
                                          <TextArea rows={4} />
                                        </FormItem>
                                      </div>
                                    ))}
                                  </>
                                );
                              }}
                            </Form.List>
                          </FormItem>
                          <MinusCircleOutlined onClick={() => remove(field.name)} />
                        </div>

                        <FormItemWrapper>
                          <FormItem name={[field.name, 'type']} label="Type">
                            <Select
                              style={{ width: '100%' }}
                              placeholder="select one Type"
                              onChange={handleChange}
                              optionLabelProp="label"
                              options={Object.keys(CATEGORY_TYPE).map((key: string) => ({
                                text: key.replace(/_/g, ' '),
                                value: CATEGORY_TYPE[key as keyof typeof CATEGORY_TYPE],
                              }))}
                            ></Select>
                          </FormItem>
                          <div className="flex-1"></div>
                        </FormItemWrapper>

                        <FormItem name={[field.name, 'weight']} label="Weight" rules={[]}>
                          <InputNumber min={0} />
                          {/* <Input /> */}
                        </FormItem>

                        <Divider orientation="left" style={{ fontWeight: '100' }}>
                          Sub Categories
                        </Divider>
                        <div className="ml-[80px]">
                          <Form.List name={[field.name, 'sub_categories']}>
                            {(subCategories, { add, remove }) => (
                              <>
                                {/* {subCategories.length === 0 && add()} */}
                                {subCategories.map(_field => (
                                  <div key={_field.key}>
                                    <Divider />
                                    <div className="flex items-center gap-x-[20px]">
                                      <FormItem name={[_field.name, 'title']} label="en" className="flex-1">
                                        <TextArea rows={4} />
                                      </FormItem>

                                      <FormItem className="flex-1" style={{ marginBottom: 0 }}>
                                        <Form.List name={[_field.name, 'trans']}>
                                          {(subCategoryTrans, { add }) => {
                                            return (
                                              <>
                                                {subCategoryTrans.length === 0 && add()}
                                                {subCategoryTrans.map(_transField => (
                                                  <div key={_transField.key} className="flex items-center">
                                                    <FormItem
                                                      name={[_transField.name, 'lang']}
                                                      style={{ display: 'none' }}
                                                      initialValue={'vi'}
                                                    >
                                                      <Input type="text" />
                                                    </FormItem>
                                                    <FormItem
                                                      name={[_transField.name, 'title']}
                                                      label={'vi'}
                                                      style={{ width: '100%' }}
                                                      labelWidth={70}
                                                    >
                                                      <TextArea rows={4} />
                                                    </FormItem>
                                                  </div>
                                                ))}
                                              </>
                                            );
                                          }}
                                        </Form.List>
                                      </FormItem>

                                      <MinusCircleOutlined onClick={() => remove(_field.name)} />
                                    </div>

                                    <FormItemWrapper>
                                      <FormItem name={[_field.name, 'type']} label="Type">
                                        <Select
                                          style={{ width: '100%' }}
                                          placeholder="select one Type"
                                          onChange={handleChange}
                                          optionLabelProp="label"
                                          options={Object.keys(CATEGORY_TYPE).map((key: string) => ({
                                            text: key.replace(/_/g, ' '),
                                            value: CATEGORY_TYPE[key as keyof typeof CATEGORY_TYPE],
                                          }))}
                                        ></Select>
                                      </FormItem>
                                      <div className="flex-1"></div>
                                    </FormItemWrapper>

                                    {/* <FormItem name={[_field.name, 'weight']} label="Weight" rules={[]}>
                                    <InputNumber min={0} onChange={onChange} defaultValue={0} />
                                  </FormItem> */}
                                  </div>
                                ))}
                                <Button
                                  type="dashed"
                                  onClick={() =>
                                    add({
                                      trans: [
                                        {
                                          lang: 'vi',
                                          title: '',
                                        },
                                      ],
                                    })
                                  }
                                  icon={<PlusOutlined />}
                                >
                                  Add Sub Category
                                </Button>
                              </>
                            )}
                          </Form.List>
                        </div>
                      </div>
                      <Divider />
                    </>
                  );
                })}
                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      trans: [
                        {
                          lang: 'vi',
                          title: '',
                        },
                      ],
                    })
                  }
                  icon={<PlusOutlined />}
                >
                  Add Category
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>

        <FormItem>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
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
