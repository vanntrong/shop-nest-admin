import { FormItem, FormItemWrapper } from '@/pages/product/detail';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';

const SocialForm = () => {
  return (
    <>
      <FormItemWrapper>
        <FormItem label="Website">
          <Form.List name={['urls', 'website']}>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(field => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <FormItem name={[field.name]} rules={[{ type: 'url' }]}>
                        <Input placeholder="URL" />
                      </FormItem>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Website
                  </Button>
                </>
              );
            }}
          </Form.List>
        </FormItem>
        <div className="flex-1"></div>
      </FormItemWrapper>

      <FormItemWrapper>
        <FormItem label="Facebook">
          <Form.List name={['urls', 'facebook']}>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(field => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <FormItem name={[field.name]} rules={[{ type: 'url' }]}>
                        <Input placeholder="URL" />
                      </FormItem>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Facebook
                  </Button>
                </>
              );
            }}
          </Form.List>
        </FormItem>
        <div className="flex-1"></div>
      </FormItemWrapper>

      <FormItemWrapper>
        <FormItem name="linkedin" label="Linkedin" rules={[{ type: 'url' }]}>
          <Form.List name={['urls', 'linkedin']}>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(field => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <FormItem name={[field.name]} rules={[{ type: 'url' }]}>
                        <Input placeholder="URL" />
                      </FormItem>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Linkedin
                  </Button>
                </>
              );
            }}
          </Form.List>
        </FormItem>
        <div className="flex-1"></div>
      </FormItemWrapper>

      <FormItemWrapper>
        <FormItem label="Telegram">
          <Form.List name={['urls', 'telegram']}>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(field => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <FormItem name={[field.name]} rules={[{ type: 'url' }]}>
                        <Input placeholder="URL" />
                      </FormItem>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Telegram
                  </Button>
                </>
              );
            }}
          </Form.List>
        </FormItem>
        <div className="flex-1"></div>
      </FormItemWrapper>

      <FormItemWrapper>
        <FormItem label="Twitter">
          <Form.List name={['urls', 'twitter']}>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(field => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <FormItem name={[field.name]} rules={[{ type: 'url' }]}>
                        <Input placeholder="URL" />
                      </FormItem>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Twitter
                  </Button>
                </>
              );
            }}
          </Form.List>
        </FormItem>
        <div className="flex-1"></div>
      </FormItemWrapper>

      <FormItemWrapper>
        <FormItem label="Youtube">
          <Form.List name={['urls', 'youtube']}>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(field => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <FormItem name={[field.name]} rules={[{ type: 'url' }]}>
                        <Input placeholder="URL" />
                      </FormItem>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Youtube
                  </Button>
                </>
              );
            }}
          </Form.List>
        </FormItem>
        <div className="flex-1"></div>
      </FormItemWrapper>

      {/* <FormItemWrapper>
          <FormItem label="Discord">
            <Form.List name={['urls', 'discord']}>
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map(field => (
                      <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <FormItem name={[field.name]} rules={[{ type: 'url' }]}>
                          <Input placeholder="URL" />
                        </FormItem>
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Space>
                    ))}
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                      Add Discord
                    </Button>
                  </>
                );
              }}
            </Form.List>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper> */}

      <FormItemWrapper>
        <FormItem label="Medium">
          <Form.List name={['urls', 'medium']}>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(field => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <FormItem name={[field.name]} rules={[{ type: 'url' }]}>
                        <Input placeholder="URL" />
                      </FormItem>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Medium
                  </Button>
                </>
              );
            }}
          </Form.List>
        </FormItem>
        <div className="flex-1"></div>
      </FormItemWrapper>

      {/* <FormItemWrapper>
          <FormItem label="Reddit">
            <Form.List name={['urls', 'reddit']}>
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map(field => (
                      <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <FormItem name={[field.name]} rules={[{ type: 'url' }]}>
                          <Input placeholder="URL" />
                        </FormItem>
                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                      </Space>
                    ))}
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                      Add Reddit
                    </Button>
                  </>
                );
              }}
            </Form.List>
          </FormItem>
          <div className="flex-1"></div>
        </FormItemWrapper> */}

      <FormItemWrapper>
        <FormItem label="Blog">
          <Form.List name={['urls', 'blog']}>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(field => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <FormItem name={[field.name]} rules={[{ type: 'url' }]}>
                        <Input placeholder="URL" />
                      </FormItem>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Blog
                  </Button>
                </>
              );
            }}
          </Form.List>
        </FormItem>
        <div className="flex-1"></div>
      </FormItemWrapper>

      <FormItemWrapper>
        <FormItem label="Rocket Chat">
          <Form.List name={['urls', 'rocket_chat']}>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(field => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <FormItem name={[field.name]} rules={[{ type: 'url' }]}>
                        <Input placeholder="URL" />
                      </FormItem>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Rocket Chat
                  </Button>
                </>
              );
            }}
          </Form.List>
        </FormItem>
        <div className="flex-1"></div>
      </FormItemWrapper>

      <FormItemWrapper>
        <FormItem name="stack_exchange" label="Stack Exchange">
          <Form.List name={['urls', 'stack_exchange']}>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(field => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <FormItem name={[field.name]} rules={[{ type: 'url' }]}>
                        <Input placeholder="URL" />
                      </FormItem>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Stack Exchange
                  </Button>
                </>
              );
            }}
          </Form.List>
        </FormItem>
        <div className="flex-1"></div>
      </FormItemWrapper>

      <FormItemWrapper>
        <FormItem name="bitcoin_talk" label="Bitcoin Talk">
          <Form.List name={['urls', 'bitcoin_talk']}>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(field => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <FormItem name={[field.name]} rules={[{ type: 'url' }]}>
                        <Input placeholder="URL" />
                      </FormItem>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Bitcoin Talk
                  </Button>
                </>
              );
            }}
          </Form.List>
        </FormItem>
        <div className="flex-1"></div>
      </FormItemWrapper>

      <FormItemWrapper>
        <FormItem name="github" label="Github" rules={[{ type: 'url' }]}>
          <Form.List name={['urls', 'github']}>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields.map(field => (
                    <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <FormItem name={[field.name]} rules={[{ type: 'url' }]}>
                        <Input placeholder="URL" />
                      </FormItem>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Add Github
                  </Button>
                </>
              );
            }}
          </Form.List>
        </FormItem>
        <div className="flex-1"></div>
      </FormItemWrapper>

      <FormItemWrapper>
        <FormItem label="Galleries">
          <Form.List name={['urls', 'galleries']}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <FormItem {...field}>
                      <Input placeholder="URL" />
                    </FormItem>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Galleries
                </Button>
              </>
            )}
          </Form.List>
        </FormItem>
        <div className="flex-1"></div>
      </FormItemWrapper>
    </>
  );
};

export default SocialForm;
