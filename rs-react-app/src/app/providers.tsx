'use client';

import { Provider } from 'react-redux';
import { ThemeProvider } from '../context/ThemeProvider';
import { store } from '../store';
import { NextIntlClientProvider } from 'next-intl';

type ProvidersProps = {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, unknown>;
};

export default function Providers({
  children,
  locale,
  messages,
}: ProvidersProps) {
  //,
  //
  return (
    <Provider store={store}>
      <ThemeProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </ThemeProvider>
    </Provider>
  );
}
