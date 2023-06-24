/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginParams } from '@/interface/user/login';
import { loginAsync } from '@/stores/user.store';
import { useDispatch } from 'react-redux';
import { formatSearch } from '@/utils/formatSearch';
import { useLocale } from '@/locales';

const initialValues: LoginParams = {
  username: 'guest',
  password: 'guest',
};

const LoginForm: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { formatMessage } = useLocale();

  const onFinished = async (form: LoginParams) => {
    const res: any = await dispatch(await loginAsync(form));

    if (!res.data) {
      return false;
    }

    const search = formatSearch(location.search);
    const from = search.from || { pathname: '/' };

    navigate(from);
  };

  return (
    <div className="flex items-center justify-center">
      <Form<LoginParams>
        onFinish={onFinished}
        className="login-page-form"
        initialValues={initialValues}
        style={{
          width: '100%',
          maxWidth: 450,
        }}
      >
        <h2 className="text-2xl text-center mb-2">{formatMessage({ id: 'title.login' })}</h2>
        <Form.Item
          name="email"
          rules={[
            // @ts-ignore
            { required: true, type: 'email', message: formatMessage({ id: 'app.settings.basic.username-message' }) },
          ]}
        >
          {/* @ts-ignore */}
          <Input placeholder={formatMessage({ id: 'app.settings.basic.username' })} />
        </Form.Item>
        <Form.Item
          name="password"
          // @ts-ignore
          rules={[{ required: true, message: formatMessage({ id: 'app.settings.basic.password-message' }) }]}
        >
          {/* @ts-ignore */}
          <Input type="password" placeholder={formatMessage({ id: 'app.settings.basic.password' })} />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" className="login-page-form_button">
            {formatMessage({ id: 'title.login' })}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
