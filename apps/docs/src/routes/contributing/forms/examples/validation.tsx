import {
  type Signal,
  component$,
  useComputed$,
  useSignal,
  useStyles$
} from "@qwik.dev/core";
import { Checkbox } from "@kunai-consulting/qwik";
import { LuCheck } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);

  const formData = useSignal<Record<string, FormDataEntryValue>>();
  const isChecked = useSignal(false);
  const isSubmitAttempt = useSignal(false);
  const isError = useComputed$(() => !isChecked.value && isSubmitAttempt.value);

  return (
    <form
      preventdefault:submit
      noValidate
      onSubmit$={(e) => {
        const form = e.target as HTMLFormElement;
        if (!isChecked.value) {
          isSubmitAttempt.value = true;
          return;
        }

        formData.value = Object.fromEntries(new FormData(form));
      }}
      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
    >
      <TermsCheckbox isChecked={isChecked} isError={isError} />
      <button type="submit">Submit</button>
      {formData.value && <div>Submitted: {JSON.stringify(formData.value, null, 2)}</div>}
    </form>
  );
});

type TermsCheckboxProps = {
  isChecked: Signal<boolean>;
  isError: Signal<boolean>;
};

export const TermsCheckbox = component$(({ isChecked, isError }: TermsCheckboxProps) => {
  return (
    <Checkbox.Root name="terms" required bind:checked={isChecked}>
      <Checkbox.HiddenInput />
      <div
        style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}
      >
        <Checkbox.Trigger class="checkbox-trigger">
          <Checkbox.Indicator class="checkbox-indicator">
            <LuCheck />
          </Checkbox.Indicator>
        </Checkbox.Trigger>
        <Checkbox.Label>I accept the Terms and Conditions</Checkbox.Label>
      </div>
      {isError.value && (
        <Checkbox.Error style={{ color: "red" }}>
          Please accept the terms and conditions
        </Checkbox.Error>
      )}
    </Checkbox.Root>
  );
});

// example styles
import styles from "./checkbox.css?inline";
