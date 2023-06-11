import AccountPage from '@/pages/account';
import { CategoryPage } from '@/pages/category';
import { CategoryDetailPage } from '@/pages/category/detail';
import { CoinPage } from '@/pages/coin';
import { CoinDetailPage } from '@/pages/coin/detail';
import { CompanyPage } from '@/pages/company';
import { CompanyDetailPage } from '@/pages/company/detail';
import { ContentPage } from '@/pages/content';
import { ContentAddPage } from '@/pages/content/add';
import { ContentDetailPage } from '@/pages/content/detail';
import DraftContentPage from '@/pages/content/draft';
import Dashboard from '@/pages/dashboard';
import { DemoEditor } from '@/pages/demoEditor';
import { EventPage } from '@/pages/event';
import { EventDetailPage } from '@/pages/event/detail';
import FundPage from '@/pages/fund';
import FundDetailPage from '@/pages/fund/detail';
import LayoutPage from '@/pages/layout';
import LoginPage from '@/pages/login';
import { PersonPage } from '@/pages/person';
import { PersonDetailPage } from '@/pages/person/detail';
import { ProductPage } from '@/pages/product';
import { ProductDetailPage } from '@/pages/product/detail';
import { FC, lazy } from 'react';
import { Navigate, RouteObject } from 'react-router';
import { useRoutes } from 'react-router-dom';
import WrapperRouteComponent from './config';

const NotFound = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/404'));
// const { logged } = useSelector(state => state.user);
const routeList: RouteObject[] = [
  {
    path: '/editor',
    element: <WrapperRouteComponent element={<DemoEditor />} auth={true} titleId="title.editor" />,
  },
  {
    path: '/login',
    element: <WrapperRouteComponent element={<LoginPage />} titleId="title.login" />,
  },
  {
    path: '/',
    element: <WrapperRouteComponent element={<LayoutPage />} auth={true} titleId="" />,
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" />,
      },
      {
        path: 'dashboard',
        element: <WrapperRouteComponent element={<Dashboard />} auth={true} titleId="title.dashboard" />,
      },
      {
        path: 'product/add',
        element: <WrapperRouteComponent element={<ProductDetailPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'product/:id',
        element: <WrapperRouteComponent element={<ProductDetailPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'product',
        element: <WrapperRouteComponent element={<ProductPage />} auth={true} titleId="title.product" />,
      },

      {
        path: 'content',
        element: <WrapperRouteComponent element={<ContentPage />} auth={true} titleId="title.content" />,
      },
      {
        path: 'category',
        element: <WrapperRouteComponent element={<CategoryPage />} auth={true} titleId="title.account" />,
      },

      {
        path: 'category/add',
        element: <WrapperRouteComponent element={<CategoryDetailPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'category/:id',
        element: <WrapperRouteComponent element={<CategoryDetailPage />} auth={true} titleId="title.account" />,
      },

      {
        path: 'content/draft',
        element: <WrapperRouteComponent element={<DraftContentPage />} auth={true} titleId="title.draft_content" />,
      },

      {
        path: 'content/draft/:id',
        element: <WrapperRouteComponent element={<ContentAddPage />} auth={true} titleId="title.draft_content" />,
      },

      {
        path: 'content/:id',
        element: <WrapperRouteComponent element={<ContentDetailPage />} auth={true} titleId="title.account" />,
      },

      {
        path: 'assets',
        element: <WrapperRouteComponent element={<CoinPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'assets/add',
        element: <WrapperRouteComponent element={<CoinDetailPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'assets/:id',
        element: <WrapperRouteComponent element={<CoinDetailPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'company',
        element: <WrapperRouteComponent element={<CompanyPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'company/add',
        element: <WrapperRouteComponent element={<CompanyDetailPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'company/:id',
        element: <WrapperRouteComponent element={<CompanyDetailPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'event',
        element: <WrapperRouteComponent element={<EventPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'event/add',
        element: <WrapperRouteComponent element={<EventDetailPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'event/:id',
        element: <WrapperRouteComponent element={<EventDetailPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'person',
        element: <WrapperRouteComponent element={<PersonPage />} titleId="title.account" />,
      },
      {
        path: 'person/add',
        element: <WrapperRouteComponent element={<PersonDetailPage />} titleId="title.account" />,
      },
      {
        path: 'person/:id',
        element: <WrapperRouteComponent element={<PersonDetailPage />} titleId="title.account" />,
      },

      {
        path: 'account',
        element: <WrapperRouteComponent element={<AccountPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'funds',
        element: <WrapperRouteComponent element={<FundPage />} titleId="title.account" />,
      },
      {
        path: 'funds/add',
        element: <WrapperRouteComponent element={<FundDetailPage />} titleId="title.account" />,
      },
      {
        path: 'funds/:id',
        element: <WrapperRouteComponent element={<FundDetailPage />} titleId="title.account" />,
      },

      {
        path: '*',
        element: <WrapperRouteComponent element={<NotFound />} auth={true} titleId="title.notFount" />,
      },
    ],
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);

  return element;
};

export default RenderRouter;
