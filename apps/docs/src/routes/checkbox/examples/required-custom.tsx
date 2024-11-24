import { component$, type Signal, useSignal, useStyles$ } from "@builder.io/qwik";
import { Checkbox } from "@kunai-consulting/qwik-components";
import { LuCheck } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);

  const formData = useSignal<Record<string, FormDataEntryValue>>();
  const isChecked = useSignal(false);
  const isError = useSignal(false);

  return (
    <form
      preventdefault:submit
      noValidate
      onSubmit$={(e) => {
        if (!isChecked.value) {
          isError.value = true;
          return;
        }
        isError.value = false;
        const form = e.target as HTMLFormElement;
        formData.value = Object.fromEntries(new FormData(form));
      }}
      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
    >
      <TermsCheckbox isChecked={isChecked} />
      {isError.value && (
        <div style={{ color: "red" }}>Please accept the terms and conditions</div>
      )}
      <button type="submit">Submit</button>
      {formData.value && <div>Submitted: {JSON.stringify(formData.value, null, 2)}</div>}
    </form>
  );
});

export const TermsCheckbox = component$(
  ({ isChecked }: { isChecked: Signal<boolean> }) => {
    return (
      <Checkbox.Root name="terms" required bind:checked={isChecked}>
        <Checkbox.HiddenNativeInput />
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
