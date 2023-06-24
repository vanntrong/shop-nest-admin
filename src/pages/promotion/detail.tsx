import { apiAddPromotion, apiGetPromotionItem, apiUpdatePromotion } from '@/api/promotion.api';
import { useLocale } from '@/locales';
import { Button, DatePicker, Form, Input, Select, Switch, message } from 'antd';
import 'antd/dist/antd.css';
import { RangePickerProps } from 'antd/lib/date-picker';
import dayjs from 'dayjs';
import { range } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const { TextArea } = Input;

const DISCOUNT_FOR_OPTIONS = [
  {
    value: 'product',
    label: 'Product',
  },
  {
    value: 'shipping',
    label: 'Shipping',
  },
];

const TYPE_PROMOTIONS_OPTIONS = [
  {
    value: 'percent',
    label: 'Percent',
  },
  {
    value: 'money',
    label: 'Money',
  },
];

export const PromotionDetailPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  // const [dataItem, setDataItem] = useState<any>({});
  const { id } = useParams();
  const [form] = Form.useForm();
  const [typePromotion, setTypePromotion] = useState<string>();
  const [discountFor, setDiscountFor] = useState<string>();

  const fetchItem = async (detailId: string) => {
    const { ...result }: any = await apiGetPromotionItem(detailId);

    if (result) {
      const item = {
        ...result.data,
      };

      form.setFieldsValue({
        ...item,
      });
      // setDataItem(item);
    }
  };

  const updateItem = async (data: any, detailId?: string) => {
    let result: any;

    if (detailId) {
      // Update
      result = await apiUpdatePromotion(detailId, data);
    } else {
      // Add
      result = await apiAddPromotion(data);
    }
    if (result) {
      if (detailId) {
        message.info(formatMessage({ id: 'global.tips.updateSuccess' }).replace('{0}', detailId));
        fetchItem(detailId);
      } else {
        message.info(formatMessage({ id: 'global.tips.createSuccess' }).replace('{0}', result.data.id));
        const path = `/promotions`;

        navigate(path);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchItem(id);
    }
  }, [id]);

  const onFinish = (values: any) => {
    updateItem(values, id);
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
        <div className="flex items-center gap-x-[20px]">
          <FormItem
            name="name"
            label="Name"
            className="flex-1"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <TextArea rows={4} />
          </FormItem>
        </div>

        <div className="flex items-center gap-x-[20px]">
          <FormItem
            name="isActive"
            label="Is Active"
            className="flex-1"
            valuePropName="checked"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Switch />
          </FormItem>
        </div>

        <div className="flex items-center gap-x-[20px]">
          <FormItem
            name="description"
            label="Description"
            className="flex-1"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <TextArea rows={4} />
          </FormItem>
        </div>

        <div className="flex items-center gap-x-[20px]">
          <FormItem name="code" label="Code" className="flex-1">
            <Input disabled={!!id} />
          </FormItem>
        </div>

        <div className="flex items-center gap-x-[20px]">
          <FormItem
            name="discountFor"
            label="Discount For"
            className="flex-1"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder="Select Discount For"
              disabled={!!id}
              value={form.getFieldValue('parentId')}
              onChange={value => {
                setDiscountFor(value);
                if (value === 'shipping') {
                  form.setFieldsValue({
                    value: 100,
                    maxValue: 100,
                    typePromotion: 'percent',
                  });
                }
              }}
              optionLabelProp="label"
              options={DISCOUNT_FOR_OPTIONS.map(item => ({
                label: item.label,
                value: item.value,
              }))}
            ></Select>
          </FormItem>
        </div>

        <div className="flex items-center gap-x-[20px]">
          <FormItem
            name="typePromotion"
            label="Type Promotion"
            className="flex-1"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder="Select Type Promotion"
              disabled={!!id || discountFor === 'shipping'}
              value={form.getFieldValue('parentId')}
              optionLabelProp="label"
              onChange={value => {
                setTypePromotion(value);
              }}
              options={TYPE_PROMOTIONS_OPTIONS.map(item => ({
                label: item.label,
                value: item.value,
              }))}
            ></Select>
          </FormItem>
        </div>

        <div className="flex items-center gap-x-[20px]">
          <FormItem
            name="value"
            label={`Value ${typePromotion === 'percent' ? '(%)' : typePromotion === 'money' ? '(VND)' : ''}`}
            className="flex-1"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input disabled={!!id || discountFor === 'shipping'} type="number" />
          </FormItem>
        </div>

        <div className="flex items-center gap-x-[20px]">
          <FormItem
            name="maxValue"
            label={`Max Value ${typePromotion === 'percent' ? '(%)' : typePromotion === 'money' ? '(VND)' : ''}`}
            className="flex-1"
          >
            <Input disabled={!!id || discountFor === 'shipping'} type="number" />
          </FormItem>
        </div>

        <div className="flex items-center gap-x-[20px]">
          <FormItem name="maxUsedTimes" label="Max Used Times" className="flex-1">
            <Input disabled={!!id} type="number" />
          </FormItem>
        </div>

        {id && (
          <div className="flex items-center gap-x-[20px]">
            <FormItem name="usedTimes" label="Used Times" className="flex-1">
              <Input disabled={true} />
            </FormItem>
          </div>
        )}

        <div className="flex items-center gap-x-[20px]">
          <FormItem name="expiredAt" label="Expired At" className="flex-1">
            <DatePicker showTime disabledTime={disabledDateTime} disabledDate={disabledDate} disabled={!!id} />
          </FormItem>
        </div>

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
