import { useCallback, useEffect, useState } from "react";

export default function useSynchronizedLocalStorage(
  key: string,
  value: string | null,
) {
  const [localState, setLocalState] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : value;
  });

  useEffect(() => {
    const onStorageChange = (event: StorageEvent) => {
      if (event.key !== key) return;

      setLocalState(event.newValue ? JSON.parse(event.newValue) : null);
    };

    window.addEventListener("storage", onStorageChange);

    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  }, [key]);

  const setLocalStateAndStorage = useCallback(
    (newValue: string | null) => {
      setLocalState(newValue);
      if (newValue) {
        localStorage.setItem(key, JSON.stringify(newValue));
      } else {
        localStorage.removeItem(key);
      }
    },
    [key],
  );
  return [localState, setLocalStateAndStorage];
}
