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
      class="date-input-container"
    >
      <DateInput.Root>
        <DateInput.Label>Appointment Date</DateInput.Label>
        <DateInput.Field separator="/">
          <DateInput.Month />
          <DateInput.Day />
          <DateInput.Year />
          <DateInput.HiddenInput name="appointment-date" />
        </DateInput.Field>
      </DateInput.Root>
      <div class="date-input-button-container">
        <button type="submit" class="submit-button">
          Submit
        </button>
      </div>
      {formData.value && (
        <div class="submitted-data">
          Submitted: {JSON.stringify(formData.value, null, 2)}
        </div>
      )}
    </form>
  );
});

// example styles
import styles from "./date-input.css?inline";
