import { Home } from '@/pages/Home';
import { Room } from '@/pages/Room';
import {
  Outlet,
  createBrowserRouter,
  type RouteObject,
} from 'react-router-dom';
import { RootLayout } from './_components/RootLayout';

function Root() {
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
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
