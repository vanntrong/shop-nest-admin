import { apiAddPerson, apiGetPersonItem, apiUpdatePerson } from '@/api/person.api';
import WikiUploadImage from '@/components/wikiblock/upload-image-v2';
import { Person } from '@/interface/person/person.interface';
import { useLocale } from '@/locales';
import { FormItemWrapper } from '@/pages/product/detail';
import { uploadImages } from '@/utils/helper';
import { Button, Divider, Form, Input, Switch, message } from 'antd';
import 'antd/dist/antd.css';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

export const PersonDetailPage: FC = () => {
  const { formatMessage } = useLocale();
  const navigate = useNavigate();
  const [dataItem, setDataItem] = useState<any>({});
  const { id } = useParams();
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState<string>();

  const fetchItem = async (detailId: string) => {
    const { ...result }: any = await apiGetPersonItem(detailId);

    if (result) {
      const item = {
        ...result.data,
      };

      form.setFieldsValue(item);
      setDataItem(item);
      setAvatar(result.data.avatar);
    }
  };
  const updateItem = async (data: Person, detailId?: string) => {
    let result: any;

    if (avatar) {
      message.loading({ content: 'Uploading...', key: 'uploading' });
      data.avatar = (
        await uploadImages([
          {
            name: dataItem.name || form.getFieldValue('name') + '.png',
            file: avatar,
          },
        ])
      )[0];

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
        const path = `/users`;

        return navigate(path);
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

  // const onReset = () => {
  //   form.resetFields();
  // };
  // const onFill = () => {
  //   form.setFieldsValue({
  //     note: 'Hello world!',
  //     gender: 'male',
  //   });
  // };

  return (
    <div className="p-3 bg-white">
      <Form form={form} name="control-hooks" onFinish={onFinish}>
        <FormItemWrapper>
          <FormItem name="name" label="Name" rules={[{ required: true }]}>
            <Input defaultValue={dataItem.name} />
          </FormItem>

          <div className="flex-1"></div>
        </FormItemWrapper>
        <FormItem name="verified" label="Verified" valuePropName="checked">
          <Switch />
        </FormItem>

        <FormItemWrapper>
          <FormItem name="email" label="Email" rules={[{ required: true }]}>
            <Input defaultValue={dataItem.email} disabled={!!id} />
          </FormItem>

          <div className="flex-1"></div>
        </FormItemWrapper>

        {!id && (
          <FormItemWrapper>
            <FormItem name="password" label="Password" rules={[{ required: true }]}>
              <Input type="password" />
            </FormItem>

            <div className="flex-1"></div>
          </FormItemWrapper>
        )}

        <FormItemWrapper>
          <FormItem name="phone" label="Phone" rules={[{ required: true }]}>
            <Input defaultValue={dataItem.phone} />
          </FormItem>

          <div className="flex-1"></div>
        </FormItemWrapper>

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
