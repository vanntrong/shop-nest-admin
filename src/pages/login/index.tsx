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
  // remember: true
};

const LoginForm: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { formatMessage } = useLocale();

  const onFinished = async (form: LoginParams) => {
    const res: any = await dispatch(await loginAsync(form));

    if (!res.user) {
      return false;
    }

    const search = formatSearch(location.search);
    const from = search.from || { pathname: '/' };

    navigate(from);
  };

  return (
    <div className="login-page">
      <Form<LoginParams> onFinish={onFinished} className="login-page-form" initialValues={initialValues}>
        <h2>{formatMessage({ id: 'title.login' })}</h2>
        <Form.Item
          name="username"
          rules={[{ required: true, message: formatMessage({ id: 'app.settings.basic.username-message' }) }]}
        >
          <Input placeholder={formatMessage({ id: 'app.settings.basic.username' })} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: formatMessage({ id: 'app.settings.basic.password-message' }) }]}
        >
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
