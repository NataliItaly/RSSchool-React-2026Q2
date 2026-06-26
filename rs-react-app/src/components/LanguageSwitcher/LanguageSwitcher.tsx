'use client';

//import { usePathname, useRouter } from 'next/navigation';
import { usePathname, useRouter } from '../../i18n/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1];

  function changeLanguage(newLocale: string) {
    const segments = pathname.split('/');
    segments[1] = newLocale;

    router.replace(pathname, { locale: newLocale });
  }

  return (
    <select
      name="language"
      id="language"
      value={locale}
      onChange={(e) => changeLanguage(e.target.value)}
    >
      <option value="en">En</option>
      <option value="ru">Ru</option>
    </select>
  );
}
