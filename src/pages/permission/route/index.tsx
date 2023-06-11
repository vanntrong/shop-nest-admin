import { FC } from 'react';
import { LocaleFormatter } from '@/locales';

const RoutePermissionPage: FC = () => {
  return (
    <div className="permission-page">
      <p className="permission-intro">
        <LocaleFormatter id="global.tips.loginResult" />
      </p>
    </div>
  );
};

export default RoutePermissionPage;
