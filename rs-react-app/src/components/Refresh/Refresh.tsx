import { useTranslations } from 'next-intl';

type RefreshProps = Readonly<{
  onRefresh: () => void;
  disabled?: boolean;
}>;

export default function Refresh({ onRefresh, disabled = false }: RefreshProps) {
  const t = useTranslations('Refresh');

  return (
    <button
      onClick={onRefresh}
      disabled={disabled}
      className="py-2 px-8 rounded-md bg-green-800 text-white hover:bg-green-600 cursor-pointer transition-all duration-600"
    >
      {t('refresh')}
    </button>
  );
}
