import Providers from '../providers';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <Providers locale={locale} messages={messages}>
      <Header />
      {children}
      <Footer />
    </Providers>
  );
}
/**
 * <html lang={locale}>
      <body>
      </body>
    </html>
 */
