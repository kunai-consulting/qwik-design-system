import { $, component$, type Signal, useSignal, useStyles$ } from "@builder.io/qwik";
import { Checkbox } from "@kunai-consulting/qwik-components";
import { LuCheck } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);

  const formData = useSignal<Record<string, FormDataEntryValue>>();

  const isChecked = useSignal<boolean | "mixed">("mixed");

  return (
    <form
      preventdefault:submit
      onSubmit$={(e) => {
        const form = e.target as HTMLFormElement;
        formData.value = Object.fromEntries(new FormData(form));
      }}
      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
    >
      <TermsCheckbox isChecked={isChecked} />
      <button
        data-test-mixed
        onClick$={() => {
          isChecked.value = "mixed";
        }}
        type="button"
      >
        Make it mixed
      </button>
    </form>
  );
});

export const TermsCheckbox = component$(
  ({ isChecked }: { isChecked: Signal<boolean | "mixed"> }) => {
    return (
      <Checkbox.Root bind:checked={isChecked}>
        <Checkbox.HiddenInput />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Checkbox.Trigger class="checkbox-trigger">
            <Checkbox.Indicator class="checkbox-indicator">
              <LuCheck />
            </Checkbox.Indicator>
          </Checkbox.Trigger>
          <Checkbox.Label>I accept the Terms and Conditions</Checkbox.Label>
        </div>
      </Checkbox.Root>
    );
  }
);

// example styles
import styles from "./checkbox.css?inline";
