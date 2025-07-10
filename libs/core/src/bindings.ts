import type { Signal, ReactivityAdapter } from "./adapter";

export function useBinding<T>(
  defaultValue: T,
  use: ReactivityAdapter,
  input?: Signal<T>
): {
  value: T;
  setValue: (val: T) => void;
  sig: Signal<T>;
} {
  const sig = use.boundSignal(input, defaultValue);

  return {
    get value() {
      return sig.value;
    },
    setValue(val: T) {
      sig.value = val;
    },
    sig
  };
}
