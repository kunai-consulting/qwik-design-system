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
import { dropdownContextId, type SubmenuState } from "./dropdown-context";
import { submenuContextId } from "./dropdown-submenu-context";
import { focusFirstItem, getSubmenuStateByContentId, getParent } from "./utils";

export type PublicDropdownItemProps = Omit<PropsOf<"div">, "onSelect$"> & {
  /** Whether the dropdown item is disabled */
  disabled?: boolean;
  /** Data value associated with this item, passed to onSelect$ when selected */
  value?: string;
  /** Event handler called when the item is selected */
  onSelect$?: (value: string | undefined) => void;
  /** Whether to close the dropdown when the item is selected (default: true) */
  closeOnSelect?: boolean;
  /** The ID of the submenu content */
  _submenuContentId?: string;
  /** The index of the item */
  _index?: number;
};

/** Interactive item within a dropdown menu */
export const DropdownItemBase = component$<PublicDropdownItemProps>(
  ({
    disabled,
    value,
    onSelect$,
    closeOnSelect = true,
    _index,
    _submenuContentId,
    ...props
  }) => {
    const context = useContext(dropdownContextId);
    const itemRef = useSignal<HTMLElement>();
    const isHoveredSig = useSignal(false);
    const isFocusedSig = useSignal(false);
    const submenuContext = useContext(submenuContextId, null);
    const currentSubmenu = useSignal<SubmenuState | undefined>(undefined);

    useTask$(async function manageSubmenu() {
      if (submenuContext) {
        currentSubmenu.value = await getSubmenuStateByContentId(
          context,
          submenuContext.contentId
        );
      }
    });

    useTask$(async function manageItemRef({ track }) {
      track(() => _index);
      track(() => itemRef.value);
      track(() => currentSubmenu.value);

      if (typeof _index !== "number") {
        console.error("DropdownItem received invalid index:", _index);
        return;
      }

      let refs = context.itemRefs;

      if (_submenuContentId) {
        const parent = await getParent(context, currentSubmenu.value?.parentId);
        refs = parent.itemRefs;
      } else if (currentSubmenu.value) {
        refs = currentSubmenu.value.itemRefs;
      }

      if (itemRef.value) {
        const newItemRefs = [...refs.value];
        while (newItemRefs.length <= _index) {
          newItemRefs.push({ ref: { value: null } });
        }
        newItemRefs[_index] = { ref: itemRef };
        refs.value = newItemRefs;
      }
    });

    const handleSelect = $(async () => {
      if (disabled) return;
      if (_submenuContentId && currentSubmenu.value) {
        currentSubmenu.value.isOpenSig.value = true;
        focusFirstItem(await currentSubmenu.value.getEnabledItems());
        return;
      }
      onSelect$?.(value);
      if (closeOnSelect) {
        context.isOpenSig.value = false;
      }
    });

    const handleKeyDown = $(async (event: KeyboardEvent) => {
      if (disabled) return;
      const { key } = event;
      if (key === "Enter" || key === " " || (_submenuContentId && key === "ArrowRight")) {
        await handleSelect();
        return;
      }
      if (key === "ArrowLeft" && currentSubmenu.value) {
        currentSubmenu.value.isOpenSig.value = false;
        return;
      }
      if (key !== "ArrowDown" && key !== "ArrowUp" && key !== "Home" && key !== "End") {
        return;
      }
      let enabledItems: HTMLElement[] = await context.getEnabledItems();
      if (_submenuContentId) {
        const parent = await getParent(context, currentSubmenu.value?.parentId);
        enabledItems = await parent.getEnabledItems();
      } else if (currentSubmenu.value) {
        enabledItems = await currentSubmenu.value.getEnabledItems();
      }
      if (enabledItems.length === 0) return;
      let nextIndex: number;
      const currentIndex = enabledItems.findIndex((item) => item === itemRef.value);
      if (currentIndex === -1) {
        enabledItems[0]?.focus();
        return;
      }
      if (key === "Home") {
        nextIndex = 0;
      } else if (key === "End") {
        nextIndex = enabledItems.length - 1;
      } else if (key === "ArrowDown") {
        nextIndex = currentIndex >= enabledItems.length - 1 ? 0 : currentIndex + 1;
      } else {
        nextIndex = currentIndex <= 0 ? enabledItems.length - 1 : currentIndex - 1;
      }
      enabledItems[nextIndex]?.focus();
    });

    return (
      <Render
        role="menuitem"
        fallback="div"
        internalRef={itemRef}
        tabIndex={disabled ? -1 : 0}
        onClick$={[handleSelect, props.onClick$]}
        onKeyDown$={[handleKeyDown, props.onKeyDown$]}
        onMouseEnter$={[$(() => (isHoveredSig.value = true)), props.onMouseEnter$]}
        onMouseLeave$={[$(() => (isHoveredSig.value = false)), props.onMouseLeave$]}
        onFocus$={[$(() => (isFocusedSig.value = true)), props.onFocus$]}
        onBlur$={[$(() => (isFocusedSig.value = false)), props.onBlur$]}
        aria-disabled={disabled}
        // Indicates whether the dropdown item is disabled
        data-disabled={disabled}
        // The identifier for the dropdown item element
        data-qds-dropdown-item
        data-hovered={isHoveredSig.value}
        data-focused={isFocusedSig.value}
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
