import { component$, isServer, type PropsOf, Slot, useTask$ } from "@qwik.dev/core";

// TODO: improve the type so that it only includes FloatingProps when floating is true.

/* This component determines whether the popover needs floating behavior, a common example where it doesn't, would be a toast. */
export const HPopoverPanel = component$<PropsOf<"div">>((props) => {
  useTask$(async () => {
    if (isServer) return;

    document.dispatchEvent(new CustomEvent("showpopoverpoly"));
  });

  return (
    <div>
      <Slot />
    </div>
  );
});
