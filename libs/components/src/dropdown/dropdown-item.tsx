import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { dropdownContextId } from "./dropdown-context";

export type DropdownItemProps = PropsOf<"div"> & {
  disabled?: boolean;
  onSelect$?: () => void;
};

export const DropdownItemBase = component$<DropdownItemProps>(
  ({ disabled, onSelect$, ...props }) => {
    const context = useContext(dropdownContextId);

    const handleClick = $(() => {
      if (disabled) return;
      onSelect$?.();
      context.isOpenSig.value = false;
    });

    const handleKeyDown = $((event: KeyboardEvent) => {
      if (disabled) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault(); //TODO HERE!!!
        handleClick();
      }
    });

    return (
      <Render
        role="menuitem"
        fallback="div"
        tabIndex={disabled ? -1 : 0}
        onClick$={handleClick}
        onKeyDown$={handleKeyDown}
        aria-disabled={disabled}
        data-disabled={disabled ? "" : undefined}
        data-qds-dropdown-item
        {...props}
      >
        <Slot />
      </Render>
    );
  }
);

export const DropdownItem = withAsChild(DropdownItemBase);
