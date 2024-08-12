import { Outlet, createBrowserRouter, type RouteObject } from 'react-router-dom';
import { RootLayout } from './_components/RootLayout';
import { QueryProvider } from './_components/QueryProvider';
import React, { Suspense } from 'react';

const Home = React.lazy(() => import('@/pages/Home'));
const Room = React.lazy(() => import('@/pages/Room'));
const CreateRoom = React.lazy(() => import('@/pages/CreateRoom'));
const Result = React.lazy(() => import('@/pages/Result'));

function Root() {
  return (
    <QueryProvider>
      <RootLayout>
        <Suspense>
          <Outlet />
        </Suspense>
      </RootLayout>
    </QueryProvider>
  );
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '*', element: <div>404</div> },
      {
        path: '/',
        element: <Home />,
      },
      { path: '/create-room', element: <CreateRoom /> },
      { path: '/room/:roomId', element: <Room /> },
      { path: '/result/:roomId', element: <Result /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
