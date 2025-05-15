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
import { useDropdownWalker } from "./use-dropdown-walker";

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
};

/** Interactive item within a dropdown menu */
export const DropdownItemBase = component$<PublicDropdownItemProps>(
  ({ disabled, value, onSelect$, closeOnSelect = true, _submenuContentId, ...props }) => {
    const context = useContext(dropdownContextId);
    const itemRef = useSignal<HTMLElement>();
    const isHoveredSig = useSignal(false);
    const isFocusedSig = useSignal(false);
    const submenuContext = useContext(submenuContextId, null);
    const currentSubmenu = useSignal<SubmenuState | undefined>(undefined);

    const handleFocus$ = $((e: FocusEvent) => {
      context.currentFocusEl.value = e.target as HTMLElement;
    });

    const focusFirstItem = $((root: HTMLElement) => {
      const { getFirstDropdownItem } = useDropdownWalker();
      setTimeout(() => {
        if (!root) return;
        const first = getFirstDropdownItem(root);
        if (first) first.focus();
      }, 50);
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
      if (!navKeys.includes(event.key)) return;

      event.preventDefault();
      event.stopPropagation();

      let root = context.rootRef.value;
      let contentId = context.contentId;

      if (_submenuContentId) {
        const parent = await getParent(context, currentSubmenu.value?.parentId);
        root = parent.rootRef.value;
        contentId = parent.contentId;
      } else if (currentSubmenu.value) {
        root = currentSubmenu.value.rootRef.value;
        contentId = currentSubmenu.value.contentId;
      }

      if (!(root && context.currentFocusEl.value)) return;

      const { getDropdownMenuItems } = useDropdownWalker();

      const items = getDropdownMenuItems(root, contentId);
      if (items.length === 0) return;
      const currentIndex = items.findIndex(
        (item) => item === context.currentFocusEl.value
      );
      if (currentIndex === -1) return;

      // Navigation keys
      let nextIndex: number | null = null;

      switch (event.key) {
        case "ArrowDown":
          nextIndex = currentIndex >= items.length - 1 ? 0 : currentIndex + 1;
          break;
        case "ArrowUp":
          nextIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
          break;
        case "Home":
          return 0;
        case "End":
          nextIndex = items.length - 1;
          break;
        case "ArrowLeft": {
          if (currentSubmenu.value) {
            currentSubmenu.value.isOpenSig.value = false;
            const parent = await getParent(context, currentSubmenu.value.parentId);
            if (parent?.rootRef.value) {
              focusFirstItem(parent.rootRef.value);
            }
          }
          break;
        }
        case "ArrowRight": {
          if (_submenuContentId && currentSubmenu.value) {
            currentSubmenu.value.isOpenSig.value = true;
            const submenuRoot = currentSubmenu.value.rootRef.value;
            if (submenuRoot) {
              focusFirstItem(submenuRoot);
            }
          }
          break;
        }
        case "Enter":
        case " ": {
          await handleSelect();
          if (_submenuContentId && currentSubmenu.value) {
            currentSubmenu.value.isOpenSig.value = true;
            const submenuRoot = currentSubmenu.value.rootRef.value;
            if (submenuRoot) {
              focusFirstItem(submenuRoot);
            }
          }
          break;
        }
        default:
          return null;
      }

      if (nextIndex !== null && items[nextIndex]) {
        items[nextIndex].focus();
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

export const DropdownItem = withAsChild(DropdownItemBase);
