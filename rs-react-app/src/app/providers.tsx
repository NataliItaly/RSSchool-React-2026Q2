'use client';

import { Provider } from 'react-redux';
import { ThemeProvider } from '../context/ThemeProvider';
import { store } from '../store';

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
