import { type PropsOf, Slot, component$ } from "@builder.io/qwik";

export const AIButton = component$((props: PropsOf<"button">) => {
  return (
    <button
      class="bg-qwik-purple-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
      type="button"
      {...props}
    >
      <Slot />
    </button>
  );
});
