import { $, component$ } from "@builder.io/qwik";

import { Datepicker } from "@kunai-consulting/qwik-components";

export default component$(() => {
  return <Datepicker.Root
  onDateChange$={$((date) => {
    console.log('Date changed:', date);
  })}
  >
    <Datepicker.Grid />
  </Datepicker.Root>;
});
