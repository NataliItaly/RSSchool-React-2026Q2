import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import { Provider } from 'react-redux';

import { setupListeners } from '@reduxjs/toolkit/query';
import App from './App.tsx';

//setupListeners(store.dispatch);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Provider store={store}> */}
    <App />
    {/* </Provider> */}
  </StrictMode>
);
