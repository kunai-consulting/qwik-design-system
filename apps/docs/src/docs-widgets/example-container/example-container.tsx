import { component$, Slot } from "@builder.io/qwik";

export const ExampleContainer = component$(() => {
  return (
    <div class="flex gap-4 justify-items-center w-full">
      <div class="flex justify-center grow">
        <Slot name="example" />
      </div>
      <div>
        <Slot name="props" />
      </div>
    </div>
  );
});
