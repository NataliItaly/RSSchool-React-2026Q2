import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Main from '../components/Main/Main';
import About from '../pages/About/About';
import NotFound from '../pages/NotFound/NotFound';
import ItemDetails from '../pages/ItemDetails/ItemDetails';

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
