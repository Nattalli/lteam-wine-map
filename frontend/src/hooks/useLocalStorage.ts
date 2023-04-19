import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function useLocalStorage<T>(initialValue: T, key: string): [T, Dispatch<SetStateAction<T>>] {
  const getValue = () => {
    const storage = localStorage.getItem(key);

    if (storage) {
      return JSON.parse(storage);
    }

    return initialValue;
  };

  const [value, setValue] = useState<T>(getValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
