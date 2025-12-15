import { useState, useCallback } from 'react';

export interface UseControllableStateParams<T> {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}

export function useControllableState<T>({
  value: valueProp,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>): [T, (value: T | ((prev: T) => T)) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState<T>(defaultValue as T);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolledValue;

  const handleChange = useCallback(
    (nextValue: T | ((prev: T) => T)) => {
      const newValue =
        typeof nextValue === 'function' ? (nextValue as (prev: T) => T)(value as T) : nextValue;

      if (!isControlled) {
        setUncontrolledValue(newValue);
      }

      onChange?.(newValue);
    },
    [isControlled, onChange, value]
  );

  return [value as T, handleChange];
}
