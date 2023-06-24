import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import { useLocale } from '@/locales';
import { RouteProps, useLocation } from 'react-router';
import { useSelector } from 'react-redux';

const PrivateRoute: FC<RouteProps> = props => {
  const { logged } = useSelector(state => state.user);
  const navigate = useNavigate();
  const { formatMessage } = useLocale();
  const location = useLocation();

  useEffect(() => {
    if (!logged) {
      navigate('/login');
    }
  }, [logged]);

  return logged ? (
    (props.element as React.ReactElement)
  ) : (
    <Result
      status="403"
      title="403"
      subTitle={formatMessage({ id: 'global.tips.unauthorized' })}
      extra={
        <Button
          type="primary"
          onClick={() => navigate(`/login${'?from=' + encodeURIComponent(location.pathname)}`, { replace: true })}
        >
          {formatMessage({ id: 'global.tips.goToLogin' })}
        </Button>
      }
    />
  );
};

export default PrivateRoute;
