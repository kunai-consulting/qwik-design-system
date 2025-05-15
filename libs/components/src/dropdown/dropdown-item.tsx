import {
  $,
  type PropsOf,
  Slot,
  component$,
  useContext,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { dropdownContextId, type SubmenuState } from "./dropdown-context";
import { submenuContextId } from "./dropdown-submenu-context";
import { getSubmenuStateByContentId, getParent } from "./utils";
import { getNextIndex } from "@kunai-consulting/qwik-utils";

export type PublicDropdownItemProps = Omit<PropsOf<"div">, "onSelect$"> & {
  /** Whether the dropdown item is disabled */
  disabled?: boolean;
  /** Data value associated with this item, passed to onSelect$ when selected */
  value?: string;
  /** Event handler called when the item is selected */
  onSelect$?: (value: string | undefined) => void;
  /** Whether to close the dropdown when the item is selected (default: true) */
  closeOnSelect?: boolean;
  /** Whether the item is a submenu */
  _index?: number;
};

/** Interactive item within a dropdown menu */
export const DropdownItemBase = component$<PublicDropdownItemProps>(
  ({ disabled, value, onSelect$, closeOnSelect = true, _index, ...props }) => {
    const context = useContext(dropdownContextId);
    const itemRef = useSignal<HTMLElement>();
    const isHoveredSig = useSignal(false);
    const isFocusedSig = useSignal(false);
    const submenuContext = useContext(submenuContextId, null);
    const currentSubmenu = useSignal<SubmenuState | undefined>(undefined);

    const handleFocus$ = $((e: FocusEvent) => {
      context.currentFocusEl.value = e.target as HTMLElement;
    });

    useTask$(async function manageSubmenu() {
      if (submenuContext) {
        currentSubmenu.value = await getSubmenuStateByContentId(
          context,
          submenuContext.contentId
        );
      }
    });

    const handleSelect = $(async () => {
      if (disabled) return;
      onSelect$?.(value);
      if (closeOnSelect) {
        context.isOpenSig.value = false;
      }
    });

    useTask$(async function registerItemRef({ track }) {
      track(() => _index);
      track(() => itemRef.value);
      track(() => currentSubmenu.value);

      if (typeof _index !== "number") {
        console.error("DropdownItem received invalid index:", _index);
        return;
      }

      let refs = context.itemRefs;

      if (props["aria-controls"]) {
        const parent = await getParent(context, submenuContext?.parentId);
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

    const handleKeyDown = $(async (event: KeyboardEvent) => {
      const navKeys = [
        "ArrowDown",
        "ArrowUp",
        "Home",
        "End",
        "ArrowLeft",
        "ArrowRight",
        "Enter",
        " "
      ];
      if (!navKeys.includes(event.key) || disabled) return;

      event.preventDefault();
      event.stopPropagation();

      let enabledItems = await context.getEnabledItems();

      if (props["aria-controls"]) {
        const parent = await getParent(context, submenuContext?.parentId);

        enabledItems = await parent.getEnabledItems();
      } else if (currentSubmenu.value) {
        enabledItems = await currentSubmenu.value.getEnabledItems();
      }

      if (!enabledItems.length) return;

      console.log("enabledItems", enabledItems.length);

      const currentIndex = enabledItems.findIndex((item) => item === itemRef.value);

      if (currentIndex === -1) {
        enabledItems[0].focus();
        return;
      }

      // Navigation keys
      let nextIndex: number | null = null;

      switch (event.key) {
        case "ArrowDown":
          nextIndex = currentIndex >= enabledItems.length - 1 ? 0 : currentIndex + 1;
          break;
        case "ArrowUp":
          nextIndex = currentIndex <= 0 ? enabledItems.length - 1 : currentIndex - 1;
          break;
        case "Home":
          return 0;
        case "End":
          nextIndex = enabledItems.length - 1;
          break;
        case "ArrowLeft": {
          if (currentSubmenu.value) {
            currentSubmenu.value.isOpenSig.value = false;
          }
          break;
        }
        case "ArrowRight": {
          if (props["aria-controls"] && currentSubmenu.value) {
            currentSubmenu.value.isOpenSig.value = true;
          }
          break;
        }
        case "Enter":
        case " ": {
          await handleSelect();
          if (props["aria-controls"] && currentSubmenu.value) {
            currentSubmenu.value.isOpenSig.value = true;
          }
          break;
        }
        default:
          return null;
      }

      if (nextIndex !== null && enabledItems[nextIndex]) {
        enabledItems[nextIndex].focus();
        return;
      }
    });

    return (
      <Render
        role="menuitem"
        fallback="div"
        internalRef={itemRef}
        tabIndex={
          context.currentFocusEl.value === itemRef.value ||
          context.currentFocusEl.value === null
            ? 0
            : -1
        }
        onClick$={[handleSelect, props.onClick$]}
        onKeyDown$={[handleKeyDown, props.onKeyDown$]}
        onMouseEnter$={[$(() => (isHoveredSig.value = true)), props.onMouseEnter$]}
        onMouseLeave$={[$(() => (isHoveredSig.value = false)), props.onMouseLeave$]}
        onFocus$={[handleFocus$, props.onFocus$]}
        onBlur$={[$(() => (isFocusedSig.value = false)), props.onBlur$]}
        aria-disabled={disabled}
        data-disabled={disabled}
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
