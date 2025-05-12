import { $, component$, useSignal } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";
import type { ISODate } from "../../calendar/types";

export const DateInputDev = component$(() => {
  const selectedDate = useSignal<ISODate | null>();
  const handleDateChange$ = $((date: ISODate | null) => {
    selectedDate.value = date;
  });

  const boundDate = useSignal<ISODate | null>("2025-04-01");
  console.log("boundDate", boundDate.value);

  const valueBasedDate = useSignal<ISODate | null>("2021-01-01");
  const handleDateChangeForValueBased$ = $((date: ISODate | null) => {
    console.log("valueBasedDate", date);
    valueBasedDate.value = date;
  });
  console.log("valueBasedDate", valueBasedDate.value);

  const formData = useSignal<Record<string, FormDataEntryValue>>();

  return (
    <div class="flex flex-col gap-10">
      <h2>On Change</h2>
      <DateInput.Root
        class="w-full flex flex-col gap-2 max-w-[300px]"
        onChange$={handleDateChange$}
      >
        <DateInput.Label class="flex items-center justify-between">
          yyyy-mm-dd input
        </DateInput.Label>
        <DateInput.DateEntry>
          <DateInput.SegmentType type="year" />
          <DateInput.Separator separator="-" />
          <DateInput.SegmentType type="month" showLeadingZero={true} />
          <DateInput.Separator separator="-" />
          <DateInput.SegmentType type="day" showLeadingZero={true} />
        </DateInput.DateEntry>
      </DateInput.Root>
      <DateInput.Root
        class="w-full flex flex-col gap-2 max-w-[300px]"
        onChange$={handleDateChange$}
      >
        <DateInput.Label class="flex items-center justify-between">
          yyyy-mm-dd input
        </DateInput.Label>
        <DateInput.DateEntry>
          <DateInput.Year />
          <DateInput.Separator separator="-" />
          <DateInput.Month showLeadingZero={true} />
          <DateInput.Separator separator="-" />
          <DateInput.Day showLeadingZero={true} />
        </DateInput.DateEntry>
      </DateInput.Root>
      {/* <DateInput.Root
        class="w-full flex flex-col gap-2 max-w-[300px]"
        //format="yyyy-mm-dd"
        onChange$={handleDateChange$}
      >
        <DateInput.Label class="flex items-center justify-between">
          yyyy-mm-dd input
        </DateInput.Label>
        <DateInput.DateEntry />

        <DateInput.HiddenInput name="date" value={selectedDate.value} />
      </DateInput.Root> */}

      <div>
        <p>Selected date: {selectedDate.value}</p>
      </div>

      <h2>Default Format</h2>
      <DateInput.Root>
        <DateInput.Label>Defaults</DateInput.Label>
        <DateInput.DateEntry>
          <DateInput.SegmentType type="month" />
          {/* <DateInput.Month /> */}
          <DateInput.Separator separator="/" />
          <DateInput.SegmentType type="day" />
          {/* <DateInput.Day /> */}
          <DateInput.Separator separator="/" />
          <DateInput.SegmentType type="year" />
          {/* <DateInput.Year /> */}
        </DateInput.DateEntry>
      </DateInput.Root>
      {/* <DateInput.Root class="w-full flex flex-col gap-2 max-w-[300px]">
        <DateInput.Label class="flex items-center justify-between">
          Default format
        </DateInput.Label>
        <DateInput.DateEntry />
      </DateInput.Root> */}

      <h2>Year/Month Only?</h2>
      <DateInput.Root>
        <DateInput.Label>Year/Month Only</DateInput.Label>
        <DateInput.DateEntry>
          <DateInput.Year />
          <DateInput.Separator separator="/" />
          <DateInput.Month showLeadingZero={true} />
        </DateInput.DateEntry>
      </DateInput.Root>

      <h2>Disabled</h2>
      <DateInput.Root disabled={true} date="2000-12-25">
        <DateInput.Label>Disabled (Always Christmas)</DateInput.Label>
        <DateInput.DateEntry>
          <DateInput.Month />
          <DateInput.Separator separator="/" />
          <DateInput.Day />
          <DateInput.Separator separator="/" />
          <DateInput.Year />
        </DateInput.DateEntry>
      </DateInput.Root>
      {/* <DateInput.Root
        class="w-full flex flex-col gap-2 max-w-[300px]"
        disabled={true}
        date="2000-12-25"
          <DateInput.Separator separator="/" />
          <DateInput.YearSegment />
        </DateInput.DateEntry>
      </DateInput.Root>
      {/* <DateInput.Root
        class="w-full flex flex-col gap-2 max-w-[300px]"
        disabled={true}
        date="2000-12-25"
      >
        <DateInput.Label class="flex items-center justify-between">
          Disabled
        </DateInput.Label>
        <DateInput.DateEntry />
      </DateInput.Root> */}

      <h2>Bound value</h2>
      {/* <DateInput.Root
        class="w-full flex flex-col gap-2 max-w-[300px]"
        bind:date={boundDate}
      >
        <DateInput.Label class="flex items-center justify-between">
          Bound value
        </DateInput.Label>
        <DateInput.DateEntry />
      </DateInput.Root> */}
      <DateInput.Root
        class="w-full flex flex-col gap-2 max-w-[300px]"
        bind:date={boundDate}
      >
        <DateInput.Label class="flex items-center justify-between">
          Bound input
        </DateInput.Label>
        <DateInput.DateEntry>
          <DateInput.Month />
          <DateInput.Separator separator="/" />
          <DateInput.Day />
          <DateInput.Separator separator="/" />
          <DateInput.Year />
        </DateInput.DateEntry>
      </DateInput.Root>

      <div>
        <p>Bound date: {boundDate.value}</p>
        <button onClick$={() => (boundDate.value = "1999-12-31")} type="button">
          Set to 1999-12-31
        </button>
        <button onClick$={() => (boundDate.value = null)} type="button">
          Set to null
        </button>
      </div>

      <h2>Value-based binding</h2>
      <div class="flex flex-col gap-10">
        <DateInput.Root
          class="w-full flex flex-col gap-2 max-w-[300px]"
          date={valueBasedDate.value}
          onChange$={handleDateChangeForValueBased$}
        >
          <DateInput.Label class="flex items-center justify-between">
            Choose your date:
          </DateInput.Label>
          <DateInput.DateEntry />
        </DateInput.Root>
        <p>Selected date: {valueBasedDate.value}</p>
        <div class="flex gap-2">
          <button
            onClick$={() =>
              (valueBasedDate.value = new Date()
                .toISOString()
                .split("T")[0] as DateInput.ISODate)
            }
            type="button"
          >
            Set to today
          </button>
          <button onClick$={() => (valueBasedDate.value = null)} type="button">
            Clear
          </button>
        </div>
      </div>

      <h2>Form</h2>
      <form
        preventdefault:submit
        onSubmit$={(e) => {
          const form = e.target as HTMLFormElement;
          const formDataObj = new FormData(form);
          const entries: Record<string, FormDataEntryValue> = {};
          formDataObj.forEach((value, key) => {
            entries[key] = value;
          });
          formData.value = entries;
        }}
        class="date-input-container"
      >
        <DateInput.Root>
          <DateInput.Label>Appointment Date</DateInput.Label>
          <DateInput.DateEntry />
          <DateInput.HiddenInput name="appointment-date" />
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

      <h2>Composition</h2>
      <DateInput.Root
        class="w-full flex flex-col gap-2 max-w-[300px]"
        onChange$={handleDateChange$}
      >
        <DateInput.Label class="flex items-center justify-between">
          Composed default placeholders
        </DateInput.Label>
        <DateInput.DateEntry>
          <DateInput.Day />
          <DateInput.Separator separator="/" />
          <DateInput.Month />
          <DateInput.Separator separator="/" />
          <DateInput.Year />
        </DateInput.DateEntry>
      </DateInput.Root>

      <DateInput.Root class="w-full flex flex-col gap-2 max-w-[300px]">
        <DateInput.Label class="flex items-center justify-between">
          Composed yyyy-mm-dd
        </DateInput.Label>
        <DateInput.DateEntry>
          <DateInput.Year placeholder="yyyy" />
          <DateInput.Separator separator="-" />
          <DateInput.Month placeholder="mm" />
          <DateInput.Separator separator="-" />
          <DateInput.Day placeholder="dd" showLeadingZero={true} />
        </DateInput.DateEntry>
      </DateInput.Root>

      <DateInput.Root class="w-full flex flex-col gap-2 max-w-[300px]">
        <DateInput.Label class="flex items-center justify-between">
          Composed m/d/yyyy
        </DateInput.Label>
        <DateInput.DateEntry>
          <DateInput.Month placeholder="m" />
          <DateInput.Separator separator="/" />
          <DateInput.Day placeholder="d" />
          <DateInput.Separator separator="/" />
          <DateInput.Year placeholder="yyyy" />
        </DateInput.DateEntry>
      </DateInput.Root>
    </div>
  );
});
