'use client';

import { useTheme } from '../../context/useTheme';
import Link from 'next/link';

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header
      className="flex justify-between gap-5 items-center p-4 border-b border-gray-300 dark:bg-gray-900
      dark:border-gray-700"
    >
      <Link
        href="/about"
        className="flex justify-center items-center px-5 py-2.5 bg-pink-700 text-white rounded-md hover:bg-pink-500 transition-all duration-500 cursor-pointer"
      >
        About
      </Link>

      <h2 className="text-center text-indigo-800 text-4xl font-bold text-shadow-xs text-shadow-pink-500 dark:text-indigo-300">
        Rick and Morty App
      </h2>
      <select
        className="px-2 py-1 rounded-md cursor-pointer dark:bg-gray-800
          dark:text-white"
        value={theme}
        onChange={(e) => {
          setTheme(e.target.value as 'light' | 'dark');
        }}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </header>
  );
}
