import { HistoryRouter, history } from '@/routes/history';
import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import viVN from 'antd/es/locale/vi_VN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Suspense, useEffect } from 'react';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { IntlProvider } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { localeConfig } from './locales';
import RenderRouter from './routes';
import { setGlobalState } from './stores/global.store';
import './styles/main.css';

const isDev = import.meta.env.MODE === 'development';

const themes = {
  light: isDev ? '../node_modules/antd/dist/antd.less' : 'https://cdn.jsdelivr.net/npm/antd@4.17.2/dist/antd.css',
  dark: isDev
    ? '../node_modules/antd/dist/antd.dark.less'
    : 'https://cdn.jsdelivr.net/npm/antd@4.17.2/dist/antd.dark.css',
};

const App: React.FC = () => {
  const { locale } = useSelector(state => state.user);
  const { theme } = useSelector(state => state.global);
  const dispatch = useDispatch();

  const setTheme = (dark = true) => {
    dispatch(
      setGlobalState({
        theme: dark ? 'dark' : 'light',
      }),
    );
  };

  /** initial theme */
  useEffect(() => {
    setTheme(theme === 'dark');
    // watch system theme change
    if (!localStorage.getItem('theme')) {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');

      function matchMode(e: MediaQueryListEvent) {
        setTheme(e.matches);
      }

      mql.addEventListener('change', matchMode);
    }
  }, []);

  // set the locale for the user
  // more languages options can be added here
  useEffect(() => {
    if (locale === 'en_US') {
      moment.locale('en');
    } else if (locale === 'vi_VN') {
      moment.locale('vi-vn');
    }
  }, [locale]);

  /**
   * handler function that passes locale
   * information to ConfigProvider for
   * setting language across text components
   */
  const getAntdLocale = () => {
    if (locale === 'en_US') {
      return enUS;
    } else if (locale === 'vi_VN') {
      return viVN;
    }
  };

  return (
    <ConfigProvider locale={getAntdLocale()} componentSize="middle">
      <ThemeSwitcherProvider defaultTheme={theme} themeMap={themes}>
        <IntlProvider locale={locale.split('_')[0]} messages={localeConfig[locale]}>
          <HistoryRouter history={history}>
            <Suspense fallback={null}>
              <RenderRouter />
            </Suspense>
          </HistoryRouter>
        </IntlProvider>
      </ThemeSwitcherProvider>
    </ConfigProvider>
  );
};

export default App;
