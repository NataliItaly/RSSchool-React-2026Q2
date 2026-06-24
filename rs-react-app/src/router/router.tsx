import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Main from '../components/Main/Main';
import About from '../app/about/page';
import NotFound from '../app/not-found';
import ItemDetails from '../app/item-details/page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Main />,
        children: [
          {
            index: true,
            element: <ItemDetails />,
          },
        ],
      },
    ],
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
