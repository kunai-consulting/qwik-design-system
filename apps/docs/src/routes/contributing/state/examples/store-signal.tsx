import { Checkbox } from "@kunai-consulting/qwik";
import {
  type Signal,
  component$,
  useSignal,
  useStore,
  useStyles$,
  useTask$
} from "@qwik.dev/core";
import { LuCheck } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);

  const myStore = useStore({
    isChecked: false
  });

  const isChecked = useStoreSignal<boolean | "mixed">(myStore, "isChecked");

  return (
    <>
      <Checkbox.Root bind:checked={isChecked}>
        <Checkbox.Trigger class="checkbox-trigger">
          <Checkbox.Indicator class="checkbox-indicator">
            <LuCheck />
          </Checkbox.Indicator>
        </Checkbox.Trigger>
      </Checkbox.Root>

      <p>Checked signal: {isChecked.value ? "true" : "false"}</p>
      <p>Checked store: {myStore.isChecked ? "true" : "false"}</p>

      <button
        type="button"
        onClick$={() => {
          isChecked.value = true;
        }}
      >
        I check the checkbox above
      </button>
    </>
  );
});

// example styles
import styles from "./checkbox.css?inline";

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
