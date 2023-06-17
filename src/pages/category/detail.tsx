import { apiAddCategory, apiGetCategoryItem, apiGetParentCategories, apiUpdateCategory } from '@/api/category.api';
import { useLocale } from '@/locales';
import { Button, Form, Input, Select, message } from 'antd';
import 'antd/dist/antd.css';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const { TextArea } = Input;

export const CategoryDetailPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const [dataItem, setDataItem] = useState<any>({});
  const { id } = useParams();
  const [form] = Form.useForm();
  const [parentCategories, setParentCategories] = useState<any[]>([]);

  const fetchItem = async (detailId: string) => {
    const { ...result }: any = await apiGetCategoryItem(detailId);

    if (result) {
      const item = {
        ...result.data,
      };

      form.setFieldsValue({
        ...item,
        parentId: item.parentCategory?.id,
      });
      setDataItem(item);
    }
  };

  const fetchParentCategories = async () => {
    const data: any = await apiGetParentCategories();

    setParentCategories(data.data);
  };

  const updateItem = async (data: any, detailId?: string) => {
    let result: any;

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
        const path = `/categories`;

        navigate(path);
      }
    }
  };

  useEffect(() => {
    fetchParentCategories();
    if (id) {
      fetchItem(id);
    }
  }, [id]);

  const onFinish = (values: any) => {
    updateItem(values, id);
  };

  const handleChange = (value: any) => {
    form.setFieldValue('parentId', value);
  };

  return (
    <div className="p-3 bg-white">
      <Form form={form} name="control-hooks" onFinish={onFinish}>
        <div className="flex items-center gap-x-[20px]">
          <FormItem name="name" label="Name" className="flex-1" labelWidth={80}>
            <TextArea rows={4} />
          </FormItem>
        </div>

        <div className="flex items-center gap-x-[20px]">
          <FormItem name="description" label="Description" className="flex-1" labelWidth={80}>
            <TextArea rows={4} />
          </FormItem>
        </div>

        {dataItem && (
          <div className="flex items-center gap-x-[20px]">
            <FormItem name="parentId" label="Parent" className="flex-1" labelWidth={80}>
              <Select
                style={{ width: '100%' }}
                placeholder="Select Parent"
                onChange={handleChange}
                value={form.getFieldValue('parentId')}
                optionLabelProp="label"
                options={parentCategories
                  .filter(item => item.id !== id)
                  .map(item => ({
                    label: item.name,
                    value: item.id,
                  }))}
              ></Select>
            </FormItem>
          </div>
        )}

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
