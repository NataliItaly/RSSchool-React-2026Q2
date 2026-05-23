import { useTheme } from "../../context/useTheme";

export default function Header () {
  const {theme, setTheme} = useTheme()
  console.log('Header theme:', theme);

  return (
    <header
      className="p-4 border-b border-gray-300 dark:bg-gray-900
      dark:border-gray-700"
    >
      <h2 className="text-center text-indigo-800 text-4xl font-bold text-shadow-xs text-shadow-pink-500 dark:text-indigo-300">
        Rick and Morty App
      </h2>
      <select
        className="absolute top-4 right-4 px-2 py-1 rounded-md cursor-pointer dark:bg-gray-800
          dark:text-white"
        value={theme}
        onChange={(e) => {
          const value = e.target.value as 'light' | 'dark';

          console.log('Header setTheme', value);
          setTheme(e.target.value as 'light' | 'dark')
        }}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </header>
  );
}


