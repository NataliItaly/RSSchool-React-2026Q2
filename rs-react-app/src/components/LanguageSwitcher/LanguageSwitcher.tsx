'use client';

//import { usePathname, useRouter } from 'next/navigation';
import { usePathname, useRouter } from '../../i18n/navigation';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale(); //pathname.split('/')[1];
  const t = useTranslations('LanguageSwitcher');

  function changeLanguage(newLocale: string) {
    const segments = pathname.split('/');
    segments[1] = newLocale;

    router.replace(pathname, { locale: newLocale });
  }

  return (
    <select
      className="rounded-md p-1 dark:text-white dark:bg-gray-800"
      name="language"
      id="language"
      value={locale}
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option className="rounded-md" value="en">
        {t('en')}
      </option>
      <option className="rounded-md" value="ru">
        {t('ru')}
      </option>
    </select>
  );
}
