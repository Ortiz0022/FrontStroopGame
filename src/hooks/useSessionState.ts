import * as React from "react";

export function useSessionState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [state, setState] = React.useState<T>(() => {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : initial;
  });

  const set = (v: T) => {
    setState(v);
    sessionStorage.setItem(key, JSON.stringify(v));
  };

  return [state, set];
}
