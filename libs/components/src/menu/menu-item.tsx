import {
  $,
  type PropsOf,
  Slot,
  component$,
  useContext,
  useSignal
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { menuContextId } from "./menu-root";
import {
  getNextMenuItem,
  getPreviousMenuItem,
  getFirstMenuItem,
  getLastMenuItem
} from "./utils";

export type PublicMenuItemProps = Omit<PropsOf<"div">, "onSelect$"> & {
  /** Whether the menu item is disabled */
  disabled?: boolean;
  /** Data value associated with this item, passed to onSelect$ when selected */
  value?: string;
  /** Event handler called when the item is selected */
  onSelect$?: (value: string | undefined) => void;
  /** Whether to close the menu when the item is selected (default: true) */
  closeOnSelect?: boolean;
};

/** Interactive item within a menu */
export const MenuItemBase = component$<PublicMenuItemProps>(
  ({ disabled, value, onSelect$, closeOnSelect = true, ...rest }) => {
    const context = useContext(menuContextId);
    const itemRef = useSignal<HTMLElement>();
    const isHoveredSig = useSignal(false);
    const isFocusedSig = useSignal(false);
    const menuContext = useContext(menuContextId);
    const isSubmenuTrigger = rest["aria-controls"] !== undefined;

    const handleFocus$ = $((e: FocusEvent) => {
      context.currentFocusEl.value = e.target as HTMLElement;
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

      if (!navKeys.includes(event.key) || disabled || !context.currentFocusEl.value)
        return;

      // For navigation, always use parent context if this is a submenu trigger
      const navContext =
        isSubmenuTrigger && menuContext?.parentContext
          ? menuContext.parentContext
          : context;

      const rootEl = navContext.contentRef?.value || navContext.rootRef?.value;

      if (!rootEl) return;

      const currentItem = context.currentFocusEl.value;

      if (!currentItem) return;

      let nextItem: HTMLElement | null = null;
      switch (event.key) {
        case "ArrowDown": {
          nextItem = getNextMenuItem(currentItem);
          if (!nextItem) {
            nextItem = getFirstMenuItem(rootEl);
          }
          break;
        }
        case "ArrowUp": {
          nextItem = getPreviousMenuItem(currentItem);
          if (!nextItem) {
            nextItem = getLastMenuItem(rootEl);
          }
          break;
        }
        case "Home": {
          nextItem = getFirstMenuItem(rootEl);
          break;
        }
        case "End": {
          nextItem = getLastMenuItem(rootEl);
          break;
        }
        case "ArrowLeft": {
          if (menuContext?.parentContext) {
            menuContext.isOpenSig.value = false;
            const parent = menuContext.parentContext;
            const parentRoot = parent.contentRef?.value || parent.rootRef?.value;
            if (parentRoot) {
              const first = getFirstMenuItem(parentRoot);

              first?.focus();
            }
          }
          break;
        }
        case "ArrowRight": {
          if (menuContext?.parentContext) {
            menuContext.isOpenSig.value = true;
            const submenuRoot =
              menuContext.contentRef?.value || menuContext.rootRef?.value;
            if (submenuRoot) {
              const first = getFirstMenuItem(submenuRoot);
              first?.focus();
            }
          }
          break;
        }
        case "Enter":
        case " ": {
          await handleSelect();
          break;
        }
        default:
          return null;
      }

      if (nextItem) {
        nextItem.focus();
        return;
      }
    });

    return (
      <Render
        role="menuitem"
        fallback="div"
        internalRef={itemRef}
        tabIndex={0}
        onClick$={[handleSelect, rest.onClick$]}
        onKeyDown$={[handleKeyDown, rest.onKeyDown$]}
        onMouseEnter$={[$(() => (isHoveredSig.value = true)), rest.onMouseEnter$]}
        onMouseLeave$={[$(() => (isHoveredSig.value = false)), rest.onMouseLeave$]}
        onFocus$={[handleFocus$, rest.onFocus$]}
        onBlur$={[$(() => (isFocusedSig.value = false)), rest.onBlur$]}
        aria-disabled={disabled}
        data-disabled={disabled}
        data-qds-menu-item
        data-hovered={isHoveredSig.value}
        data-focused={isFocusedSig.value}
        {...rest}
      >
        <Slot />
      </Render>
    );
  }
);

export const MenuItem = withAsChild(MenuItemBase);
