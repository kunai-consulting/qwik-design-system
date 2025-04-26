import { type Signal, useSignal, useTask$ } from "@builder.io/qwik";

export function useStoreSignal<T>(
  store: Record<string, unknown>,
  key: keyof typeof store
): Signal<T> {
  const internalSig = useSignal<T>(store[key] as T);

  useTask$(function setStoreValue({ track }) {
    track(internalSig);

    store[key] = internalSig.value;
  });

  useTask$(function getStoreValue({ track }) {
    track(() => store[key]);

    internalSig.value = store[key] as T;
  });

  return internalSig;
}
