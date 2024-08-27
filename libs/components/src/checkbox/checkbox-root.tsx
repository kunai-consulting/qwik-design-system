import { component$ } from '@builder.io/qwik';

export const CheckboxRoot = component$(() => {
  return (
    <div>
      <Slot />
    </div>
  );
});
