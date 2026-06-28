import React from 'react';
import { useTranslations } from 'next-intl';

type CrashState = {
  crash: boolean;
};

export default function BuggyButton() {
  const [crashState, setCrashState] = React.useState<CrashState>({
    crash: false,
  });
  const t = useTranslations('BuggyButton');

  if (crashState.crash) {
    throw new Error('Test error');
  }
  return (
    <button
      className="block px-8 py-4 cursor-pointer bg-pink-700 text-white hover:bg-pink-500 text-lg rounded-md mx-auto my-5 transition-all duration-600"
      onClick={() => setCrashState({ crash: true })}
    >
      {t('crash')}
    </button>
  );
}
