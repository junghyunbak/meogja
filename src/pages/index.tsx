import { Home } from '@/pages/Home';
import { Room } from '@/pages/Room';
import {
  Outlet,
  createBrowserRouter,
  type RouteObject,
} from 'react-router-dom';
import { RootLayout } from './_components/RootLayout';
import { QueryProvider } from './_components/QueryProvider';

function Root() {
  return (
    <QueryProvider>
      <RootLayout>
        <Outlet />
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
      { path: '/room/:roomId', element: <Room /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
