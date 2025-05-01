import {
  $,
  type PropsOf,
  Slot,
  component$,
  useContext,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { getNextIndex } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { dropdownContextId } from "./dropdown-context";
export type PublicDropdownItemProps = PropsOf<"div"> & {
  /** Whether the dropdown item is disabled */
  disabled?: boolean;
  /** Event handler called when the item is selected */
  onSelect$?: () => void;
  _index?: number;
};

/** Interactive item within a dropdown menu */
export const DropdownItemBase = component$<PublicDropdownItemProps>(
  ({ disabled, onSelect$, _index, ...props }) => {
    const context = useContext(dropdownContextId);
    const itemRef = useSignal<HTMLElement>();

    useTask$(function getIndexOrder() {
      if (_index === undefined) {
        throw new Error("DropdownItem cannot find its proper index.");
      }

      context.itemRefs.value[_index] = {
        ref: itemRef
      };
    });

    const handleClick = $(() => {
      if (disabled) return;
      onSelect$?.();
      context.isOpenSig.value = false;
    });

    const handleKeyDown = $((event: KeyboardEvent) => {
      if (disabled) return;
      if (event.key === "Enter" || event.key === " ") {
        handleClick();
      }
    });

    return (
      <Render
        role="menuitem"
        fallback="div"
        internalRef={itemRef}
        tabIndex={disabled ? -1 : 0}
        onClick$={[handleClick, props.onClick$]}
        onKeyDown$={[handleKeyDown, props.onKeyDown$]}
        aria-disabled={disabled}
        // Indicates whether the dropdown item is disabled
        data-disabled={disabled}
        // The identifier for the dropdown item element
        data-qds-dropdown-item
        {...props}
      >
        <Slot />
      </Render>
    );
  }
);

export const DropdownItem = withAsChild(DropdownItemBase, (props) => {
  const nextIndex = getNextIndex("dropdown");
  props._index = nextIndex;
  return props;
});
