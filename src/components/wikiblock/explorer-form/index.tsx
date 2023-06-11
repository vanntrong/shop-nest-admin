import { FormItem } from '@/pages/product/detail';
import { Button, Form, Input, Space } from 'antd';
import React from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const ExplorerForm = () => {
  return (
    <FormItem name="explorer" label="Explorer">
      <Form.List name="explorer">
        {(fields, { add, remove }) => (
          <>
            {fields.map(field => (
              <Space key={field.key} style={{ display: 'flex', marginBottom: 8, width: '100%' }} align="baseline">
                <Form.Item name={[field.name, 'label']} rules={[{ required: true }]}>
                  <Input style={{ width: 400 }} placeholder="Name" />
                </Form.Item>
                <Form.Item name={[field.name, 'href']} rules={[{ required: true }, { type: 'url' }]}>
                  <Input style={{ width: 400 }} placeholder="Href" />
                </Form.Item>
                <Form.Item name={[field.name, 'note']}>
                  <Input style={{ width: 400 }} placeholder="Note" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Space>
            ))}
            <Button
              type="dashed"
              onClick={() => {
                add();
              }}
              icon={<PlusOutlined />}
            >
              Add Explorer
            </Button>
          </>
        )}
      </Form.List>
    </FormItem>
  );
};

export default ExplorerForm;
