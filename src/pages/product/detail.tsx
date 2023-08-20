/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, DatePicker, Divider, Form, Input, InputNumber, message, Select, Space, Switch } from 'antd';
import 'antd/dist/antd.css';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const { TextArea } = Input;

import { apiGetCategorySelectBox } from '@/api/category.api';
import { apiAddProduct, apiGetProductItem, apiUpdateProduct } from '@/api/product.api';
import WikiUploadImage from '@/components/wikiblock/upload-image-v2';
import { Product } from '@/interface/product/product.interface';
import { useLocale } from '@/locales';
import { uploadImages } from '@/utils/helper';
import { RangePickerProps } from 'antd/lib/date-picker';
import dayjs from 'dayjs';
import { isEmpty, isNil, omitBy, range } from 'lodash';
import styled from 'styled-components';
import { formatCategoriesData } from '.';
import EditorV2 from '@/components/editorV2';
import moment from 'moment';

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
  const [dataItem, setDataItem] = useState<any>({});
  const { id } = useParams();
  const [form] = Form.useForm();
  const [thumbnailUrl, setThumbnailUrl] = useState<string>();
  const [images, setImages] = useState<any>([]);

  const fetchCategory = async () => {
    const { data = [] }: any = await apiGetCategorySelectBox();

    if (data) {
      const categories = formatCategoriesData(data);

      setCategories(categories);
    }
  };

  const fetchItem = async (detailId: string) => {
    const { data }: any = await apiGetProductItem(detailId);

    if (data) {
      const item = {
        ...data,
      };

      form.setFieldsValue({
        ...item,
        saleEndAt: item.saleEndAt ? moment(item.saleEndAt) : undefined,
        categoryId: item.category?.id,
        articles: data.articles.map((a: any) => a.articleUrl),
      });
      setDataItem(item);
      setImages(item.images);
      setThumbnailUrl(item.thumbnailUrl);
    }
  };

  const updateItem = async (data: Partial<Product>, detailId?: string) => {
    let result: any;

    if (data.salePrice || data.saleEndAt) {
      if (!data.salePrice) {
        message.error('Please enter salePrice');

        return;
      }

      if (!data.saleEndAt) {
        message.error('Please enter saleEndAt');

        return;
      }
    }

    console.log(data);
    data = {
      ...omitBy(data, value => {
        if (typeof value === 'string') {
          return isNil(value) || isEmpty(value);
        } else {
          return isNil(value);
        }
      }),
    };

    if (thumbnailUrl) {
      message.loading({ content: 'Uploading thumbnailUrl...', key: 'thumbnailUrl' });
      data.thumbnailUrl = (
        await uploadImages([
          {
            file: thumbnailUrl,
            name: form.getFieldValue('name') + '.png',
          },
        ])
      )[0];
      message.success({ content: 'Upload thumbnailUrl success!', key: 'thumbnailUrl' });
    }

    if (images) {
      message.loading({ content: 'Uploading images...', key: 'images' });
      data.images = await uploadImages(
        images.map((image: any, index: number) => ({
          file: image,
          name: form.getFieldValue('name') + `-${index}` + '.png',
        })),
      );

      message.success({ content: 'Upload images success!', key: 'images' });
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
        const path = `/products`;

        return navigate(path);
      }
    }
  };

  useEffect(() => {
    fetchCategory();
    if (id) {
      fetchItem(id);
    }
  }, [id]);

  const onFinish = (values: any) => {
    updateItem(values, dataItem.id);
  };

  const onReset = () => {
    form.resetFields();
    setThumbnailUrl(dataItem.avatar ?? '');
  };

  const disabledDateTime = () => {
    const now = Date.now();
    const nowDate = new Date(now);
    const nowHour = nowDate.getHours() + 1;
    const nowMinute = nowDate.getMinutes() + 30;
    const nowSecond = nowDate.getSeconds() + 30;

    return {
      disabledHours: () => range(0, 24).splice(0, nowHour),
      disabledMinutes: () => range(0, nowMinute),
      disabledSeconds: () => range(0, nowSecond),
    };
  };

  const disabledDate: RangePickerProps['disabledDate'] = current => {
    return current && current < dayjs().endOf('day');
  };

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

        <div className="flex items-center gap-x-[20px]">
          <FormItem name="isActive" label="Is Active" className="flex-1" valuePropName="checked">
            <Switch />
          </FormItem>
        </div>
        <FormItem
          label="ThumbnailUrl"
          valuePropName="fileList"
          rules={[
            {
              required: true,
              type: 'string',
            },
          ]}
        >
          <WikiUploadImage
            fileList={thumbnailUrl ? [thumbnailUrl] : []}
            onChange={file => setThumbnailUrl(file)}
            onRemoveItem={() => setThumbnailUrl(undefined)}
            limit={1}
            showUploadList
          />
        </FormItem>
        <Divider orientation="left" style={{ fontWeight: '100' }}>
          Description
        </Divider>
        <div className="flex items-center gap-x-[20px]">
          <FormItem
            name="description"
            label="Description"
            className="flex-1"
            rules={[
              {
                required: true,
                type: 'string',
              },
            ]}
          >
            <TextArea rows={4} />
          </FormItem>
        </div>

        <Divider></Divider>
        <FormItemWrapper>
          <FormItem
            name="categoryId"
            label="Category"
            rules={[
              {
                required: true,
                type: 'string',
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder="select one category"
              optionLabelProp="label"
              filterOption={(input, option) => {
                return (option!.label as string).toLowerCase().includes(input.toLowerCase());
              }}
            >
              {categories.map((category: any) => {
                return (
                  <Option value={category.id} label={category.name}>
                    <div className="demo-option-label-item flex items-center justify-between">
                      <span>{category.name}</span>
                      <span>level {category.level}</span>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItem
          label="Images"
          valuePropName="fileList"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <WikiUploadImage
            fileList={images}
            onChange={file => setImages((prev: any) => [...prev, file])}
            onRemoveItem={key => setImages((prev: any) => prev.filter((file: string) => file !== key))}
            limit={10}
            showUploadList
            multiple
          />
        </FormItem>

        <FormItemWrapper>
          <FormItem
            label="Inventory"
            name="inventory"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              type="number"
              style={{
                width: '100%',
              }}
            />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem
            label="Price(VND)"
            name="price"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              type="number"
              style={{
                width: '100%',
              }}
            />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem
            label="Weight(g)"
            name="weight"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              type="number"
              style={{
                width: '100%',
              }}
            />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem label="Sale Price(VND)" name="salePrice">
            <InputNumber
              type="number"
              style={{
                width: '100%',
              }}
            />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>

        <FormItemWrapper>
          <FormItem label="Sale End At" name="saleEndAt">
            <DatePicker showTime disabledTime={disabledDateTime} disabledDate={disabledDate} />
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItemWrapper>
          <FormItem label="Articles">
            <Form.List name="articles">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(field => (
                    <>
                      <div className="flex gap-2">
                        <FormItem
                          {...field}
                          name={[field.name]}
                          fieldKey={[field.fieldKey]}
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                          style={{ flex: 1 }}
                        >
                          <Input />
                        </FormItem>
                        <Button
                          type="dashed"
                          onClick={() => remove(field.name)}
                          block
                          style={{
                            width: 'fit-content',
                          }}
                        >
                          Remove Article
                        </Button>
                      </div>
                    </>
                  ))}
                  <FormItem>
                    <Button type="dashed" onClick={() => add()} block>
                      Add Article
                    </Button>
                  </FormItem>
                </>
              )}
            </Form.List>
          </FormItem>

          <div className="flex-1"></div>
        </FormItemWrapper>

        <div className="flex items-center gap-x-[20px]">
          <FormItem
            name="detailDescription"
            label="Detail Description"
            className="flex-1"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <EditorV2
              data={dataItem.detailDescription}
              onChange={data => form.setFieldValue('detailDescription', data)}
            />
          </FormItem>
        </div>

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
