import { useState } from "react";

// useState ga o'xshaydi, lekin qiymat brauzer xotirasida (localStorage) saqlanadi
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue; // xotira bloklangan bo'lsa ham sayt ishlayveradi
    }
  });

  const update = (next) => {
    setValue((prev) => {
      const result = typeof next === "function" ? next(prev) : next;
      try {
        localStorage.setItem(key, JSON.stringify(result));
      } catch {
        /* xotira mavjud emas, e'tibor bermaymiz */
      }
      return result;
    });
  };

  return [value, update];
}
