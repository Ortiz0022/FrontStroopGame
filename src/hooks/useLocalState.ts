import { useEffect, useState } from "react";

export function useLocalState<T>(key: string, init: T) {
  const [value, setValue] = useState<T>(() => {
    const raw = localStorage.getItem(key);
    if (raw == null) return init;
    try {
      // Caso normal: lo guardamos como JSON
      return JSON.parse(raw) as T;
    } catch {
      // Caso legado: había un string plano 
      // Lo usamos tal cual y en el próximo render se guardará como JSON.
      return (raw as unknown) as T;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // no
    }
  }, [key, value]);

  return [value, setValue] as const;
}
