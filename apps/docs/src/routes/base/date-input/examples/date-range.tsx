import { component$, useSignal, useStyles$ } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);
  const departureDate = useSignal<DateInput.ISODate | null>(null);
  const returnDate = useSignal<DateInput.ISODate | null>(null);
  const formData = useSignal<Record<string, FormDataEntryValue>>();

  return (
    <form
      class="date-input-container"
      preventdefault:submit
      onSubmit$={(e) => {
        const form = e.target as HTMLFormElement;
        formData.value = Object.fromEntries(new FormData(form));
      }}
    >
      <DateInput.Root>
        <DateInput.Label>Travel dates</DateInput.Label>
        <div class="date-input-date-range">
          <DateInput.DateEntry bind:date={departureDate} data-range-start-entry>
            <DateInput.Year />
            <DateInput.Separator separator="-" />
            <DateInput.Month showLeadingZero={true} />
            <DateInput.Separator separator="-" />
            <DateInput.Day showLeadingZero={true} />
            <DateInput.HiddenInput name="departure-date" />
          </DateInput.DateEntry>
          <DateInput.Separator separator="to" />
          <DateInput.DateEntry bind:date={returnDate} data-range-end-entry>
            <DateInput.Year />
            <DateInput.Separator separator="-" />
            <DateInput.Month showLeadingZero={true} />
            <DateInput.Separator separator="-" />
            <DateInput.Day showLeadingZero={true} />
            <DateInput.HiddenInput name="return-date" />
          </DateInput.DateEntry>
        </div>
      </DateInput.Root>

      <p>
        Departure date: <span class="external-value">{departureDate.value}</span>
        <br />
        Return date: <span class="external-value">{returnDate.value}</span>
      </p>
      <div class="date-input-button-container">
        <button
          onClick$={() => (departureDate.value = "2001-01-01")}
          type="button"
          class="set-value-button"
        >
          Set departure to 2001-01-01
        </button>
        <button
          onClick$={() => (departureDate.value = null)}
          type="button"
          class="set-null-button"
        >
          Clear departure
        </button>
        <button
          onClick$={() => (returnDate.value = "2099-12-31")}
          type="button"
          class="set-value-button"
        >
          Set return to 2099-12-31
        </button>
        <button
          onClick$={() => (returnDate.value = null)}
          type="button"
          class="set-null-button"
        >
          Clear return
        </button>
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
