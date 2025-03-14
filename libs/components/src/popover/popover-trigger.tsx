import { Slot, component$, $, type PropsOf, useOnDocument } from "@qwik.dev/core";

type PopoverTriggerProps = {
  popovertarget?: string;
  disableClickInitPopover?: boolean;
} & PropsOf<"button">;

export const HPopoverTrigger = component$<PopoverTriggerProps>(
  (props: PopoverTriggerProps) => {
    // event is created after teleported properly
    useOnDocument(
      "showpopoverpoly",
      $(() => {})
    );

    return (
      <button type="button">
        <Slot />
      </button>
    );
  }
);
