import { useCallback, useState } from "react";

type WithDefault<T extends string | undefined> = T extends string
  ? string
  : string | null;

export function useStoredState<T extends string | undefined>(
  storageKey: string,
  defaultValue?: T
): [WithDefault<T>, (nextValue: string | null) => void] {
  const initialValue =
    typeof localStorage !== "undefined"
      ? localStorage.getItem(storageKey)
      : undefined;
  const [value, setValue] = useState(initialValue ?? defaultValue ?? null);

  const storeAndSetValue = useCallback(
    (nextValue: string | null) => {
      try {
        if (typeof localStorage !== "undefined") {
          if (nextValue === null) {
            localStorage.removeItem(storageKey);
          } else {
            localStorage.setItem(storageKey, nextValue);
          }
        }
      } catch {
        // Fail silently
      } finally {
        setValue(nextValue);
      }
    },
    [storageKey]
  );

  return [value as WithDefault<T>, storeAndSetValue];
}
