import { useState, useEffect } from "react";

// Simple global store
let globalValue = "Initial Global Value";
const listeners = new Set<(value: string) => void>();

export const getGlobalValue = () => globalValue;

export const setGlobalValue = (newValue: string) => {
  globalValue = newValue;
  listeners.forEach((listener) => listener(globalValue));
};

export const useGlobalValue = () => {
  const [value, setValue] = useState(globalValue);

  useEffect(() => {
    const listener = (newValue: string) => {
      setValue(newValue);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    value,
    setValue: setGlobalValue,
  };
};
