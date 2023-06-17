import Dashboard from '@/pages/dashboard';
import LayoutPage from '@/pages/layout';
import LoginPage from '@/pages/login';
import { FC, lazy } from 'react';
import { Navigate, RouteObject } from 'react-router';
import { useRoutes } from 'react-router-dom';
import WrapperRouteComponent from './config';
import { PersonPage } from '@/pages/person';
import { PersonDetailPage } from '@/pages/person/detail';
import { CategoryPage } from '@/pages/category';
import { CategoryDetailPage } from '@/pages/category/detail';
import { ProductPage } from '@/pages/product';
import { ProductDetailPage } from '@/pages/product/detail';
import { OrderPage } from '@/pages/order';

const NotFound = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/404'));
// const { logged } = useSelector(state => state.user);
const routeList: RouteObject[] = [
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
        path: 'products/add',
        element: <WrapperRouteComponent element={<ProductDetailPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'products/:id',
        element: <WrapperRouteComponent element={<ProductDetailPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'products',
        element: <WrapperRouteComponent element={<ProductPage />} auth={true} titleId="title.product" />,
      },
      {
        path: 'categories',
        element: <WrapperRouteComponent element={<CategoryPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'categories/add',
        element: <WrapperRouteComponent element={<CategoryDetailPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'categories/:id',
        element: <WrapperRouteComponent element={<CategoryDetailPage />} auth={true} titleId="title.account" />,
      },
      {
        path: 'orders',
        element: <WrapperRouteComponent element={<OrderPage />} auth={true} titleId="title.account" />,
      },
      // {
      //   path: 'assets/add',
      //   element: <WrapperRouteComponent element={<CoinDetailPage />} auth={true} titleId="title.account" />,
      // },
      // {
      //   path: 'assets/:id',
      //   element: <WrapperRouteComponent element={<CoinDetailPage />} auth={true} titleId="title.account" />,
      // },
      // {
      //   path: 'company',
      //   element: <WrapperRouteComponent element={<CompanyPage />} auth={true} titleId="title.account" />,
      // },
      // {
      //   path: 'company/add',
      //   element: <WrapperRouteComponent element={<CompanyDetailPage />} auth={true} titleId="title.account" />,
      // },
      // {
      //   path: 'company/:id',
      //   element: <WrapperRouteComponent element={<CompanyDetailPage />} auth={true} titleId="title.account" />,
      // },
      // {
      //   path: 'event',
      //   element: <WrapperRouteComponent element={<EventPage />} auth={true} titleId="title.account" />,
      // },
      // {
      //   path: 'event/add',
      //   element: <WrapperRouteComponent element={<EventDetailPage />} auth={true} titleId="title.account" />,
      // },
      // {
      //   path: 'event/:id',
      //   element: <WrapperRouteComponent element={<EventDetailPage />} auth={true} titleId="title.account" />,
      // },
      {
        path: 'users',
        element: <WrapperRouteComponent element={<PersonPage />} titleId="title.account" />,
      },
      {
        path: 'users/add',
        element: <WrapperRouteComponent element={<PersonDetailPage />} titleId="title.account" />,
      },
      {
        path: 'users/:id',
        element: <WrapperRouteComponent element={<PersonDetailPage />} titleId="title.account" />,
      },

      // {
      //   path: 'account',
      //   element: <WrapperRouteComponent element={<AccountPage />} auth={true} titleId="title.account" />,
      // },
      // {
      //   path: 'funds',
      //   element: <WrapperRouteComponent element={<FundPage />} titleId="title.account" />,
      // },
      // {
      //   path: 'funds/add',
      //   element: <WrapperRouteComponent element={<FundDetailPage />} titleId="title.account" />,
      // },
      // {
      //   path: 'funds/:id',
      //   element: <WrapperRouteComponent element={<FundDetailPage />} titleId="title.account" />,
      // },

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
