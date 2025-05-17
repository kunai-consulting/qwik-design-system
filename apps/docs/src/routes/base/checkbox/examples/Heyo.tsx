import { component$ } from "@builder.io/qwik";
import { Checkbox } from "@kunai-consulting/qwik";

export const Heyo = component$(() => {
  return (
    <div>
      <p>This is the Heyo component, providing a description.</p>
      <Checkbox.Description>Description from Heyo component</Checkbox.Description>
    </div>
  );
});
