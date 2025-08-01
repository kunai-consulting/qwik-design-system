import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import { $, type PropsOf, Slot, component$, useContext, useSignal } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { menuContextId } from "./menu-root";
import {
  getFirstMenuItem,
  getLastMenuItem,
  getNextMenuItem,
  getPreviousMenuItem
} from "./utils";

export type PublicMenuItemProps = Omit<PropsOf<"div">, "onSelect$"> & {
  /** Event handler called when the item is selected */
  onSelect$?: (value: string | undefined) => void;
  /** Whether to close the menu when the item is selected (default: true) */
  closeOnSelect?: boolean;
} & BindableProps<{
    value: string;
    disabled: boolean;
  }>;

/** Interactive item within a menu */
export const MenuItemBase = component$<PublicMenuItemProps>(
  ({ onSelect$, closeOnSelect = true, ...rest }) => {
    const context = useContext(menuContextId);
    const itemRef = useSignal<HTMLElement>();
    const isHoveredSig = useSignal(false);
    const isFocusedSig = useSignal(false);
    const menuContext = useContext(menuContextId);
    const isSubmenuTrigger = rest["aria-controls"] !== undefined;

    const { valueSig, disabledSig: isDisabledSig } = useBindings(rest, {
      value: "",
      disabled: false
    });

    const handleFocus$ = $((e: FocusEvent) => {
      context.currentFocusEl.value = e.target as HTMLElement;
    });

    const handleSelect = $(async () => {
      if (context.disabled.value || isDisabledSig.value) return;
      onSelect$?.(valueSig.value);
      context.onItemSelection$?.(valueSig.value);
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

      if (
        !navKeys.includes(event.key) ||
        isDisabledSig.value ||
        !context.currentFocusEl.value
      )
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
          if (navContext) {
            navContext.isOpenSig.value = false;
            const parent = navContext.parentContext;
            const parentRoot = parent?.contentRef?.value || parent?.rootRef?.value;
            if (parentRoot) {
              nextItem = navContext.triggerRef.value as HTMLElement;
            }
          }
          break;
        }
        case "ArrowRight": {
          if (isSubmenuTrigger) {
            menuContext.isOpenSig.value = true;
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
        aria-disabled={context.disabled.value || isDisabledSig.value}
        data-disabled={context.disabled.value || isDisabledSig.value}
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
