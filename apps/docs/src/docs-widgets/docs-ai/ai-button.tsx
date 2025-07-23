import { type HTMLElementAttrs, Slot, component$ } from "@qwik.dev/core";

export const AIButton = component$((props: HTMLElementAttrs<"button">) => {
  return (
    <button
      class="bg-neutral-primary border-b-2 border-r-2 border-neutral-interactive/30 text-white px-4 py-2 disabled:opacity-50 rounded-md cursor-pointer hover:bg-neutral-background/30 transition-all flex items-center gap-2 justify-center"
      type="button"
      {...props}
    >
      <Slot />
    </button>
  );
});
