import * as React from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  console.log('useLocalStorage file loaded');
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      console.log('loaded:', item);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      console.log('saving:', value);
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
      console.log('after save:', localStorage.getItem(key));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
