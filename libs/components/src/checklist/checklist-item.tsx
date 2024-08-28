import { component$, Slot } from '@builder.io/qwik';

export const ChecklistItem = component$(() => {
  return (
    <li>
      <Slot />
    </li>
  );
});
