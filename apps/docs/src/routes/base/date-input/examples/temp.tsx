import { component$ } from "@builder.io/qwik";
import { DateInputTemp } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <DateInputTemp.Root>
      <DateInputTemp.Segment>Segment 1</DateInputTemp.Segment>
      <DateInputTemp.Segment>Segment 2</DateInputTemp.Segment>
      <DateInputTemp.Segment>Segment 3</DateInputTemp.Segment>
    </DateInputTemp.Root>
  );
});
