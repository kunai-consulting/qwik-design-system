import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);

  const formData = useSignal<Record<string, FormDataEntryValue>>();

  return (
    <form
      preventdefault:submit
      onSubmit$={(e) => {
        const form = e.target as HTMLFormElement;
        formData.value = Object.fromEntries(new FormData(form));
      }}
      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
    >
      <DateInput.Root>
        <DateInput.Label>Appointment Date</DateInput.Label>
        <DateInput.DateEntry />
        <DateInput.HiddenInput name="appointment-date" />
      </DateInput.Root>
      <button type="submit">Submit</button>
      {formData.value && <div>Submitted: {JSON.stringify(formData.value, null, 2)}</div>}
    </form>
  );
});

// example styles
import styles from "./date-input.css?inline";
