'use client';

import { useTranslations } from 'next-intl';

type PaginationProps = {
  prevPage: () => void;
  page: number;
  nextPage: () => void;
  hasNext: boolean;
};

export default function Pagination({
  prevPage,
  page,
  nextPage,
  hasNext,
}: PaginationProps) {
  const t = useTranslations('Pagination');

  return (
    <div className="mt-5 flex justify-center items-center gap-4">
      <button
        className="cursor-pointer bg-indigo-700 text-white px-4 py-1.5 hover:bg-indigo-600 disabled:opacity-70 disabled:hover:bg-indigo-700 transition-all duration-500 rounded-md"
        onClick={prevPage}
        disabled={page === 1}
      >
        {t('prev')}
      </button>

      <span className="mx-2.5 my-0 text-xl">{page}</span>

      <button
        className="cursor-pointer bg-indigo-700 text-white px-4 py-1.5 hover:bg-indigo-600 disabled:opacity-70 disabled:hover:bg-indigo-700 transition-all duration-500 rounded-md"
        onClick={nextPage}
        disabled={!hasNext}
      >
        {t('next')}
      </button>
    </div>
  );
}
