import { useTheme } from "../../context/useTheme";

export default function Header () {
  const {theme, setTheme} = useTheme()

  return (
    <header className="p-4 border-b border-gray-300">
      <h2 className="text-center text-indigo-800 text-4xl font-bold text-shadow-xs text-shadow-pink-500">
        Rick and Morty App
      </h2>
      <select
        value={theme}
        onChange={e =>
          setTheme(e.target.value as 'light' | 'dark')
        }
      >
        <option value="light">
          Light
        </option>
        <option value="dark">
          Dark
        </option>
      </select>
    </header>
  );
}


