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
import { menuContextId } from "./menu-root";

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

    useTask$(async function registerItemRef({ track }) {
      track(() => itemRef.value);

      let refs = context.itemRefs;

      if (isSubmenuTrigger) {
        const parent = menuContext?.parentContext;
        if (parent) {
          refs = parent.itemRefs;
        }
      }

      if (itemRef.value) {
        let newItemRefs = [...refs.value];

        const oldIndex = newItemRefs.findIndex((ref) => ref.ref.value === itemRef.value);

        if (oldIndex === -1) {
          newItemRefs = [...newItemRefs, { ref: itemRef }];
        }

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

      if (isSubmenuTrigger) {
        const parent = menuContext?.parentContext;
        if (parent) {
          enabledItems = await parent.getEnabledItems();
        }
      }

      if (!enabledItems.length) return;

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
          nextIndex = 0;
          break;
        case "End":
          nextIndex = enabledItems.length - 1;
          break;
        case "ArrowLeft": {
          if (menuContext?.parentContext) {
            menuContext.isOpenSig.value = false;
            const parent = menuContext.parentContext;
            const parentItems = await parent.getEnabledItems();
            if (parentItems.length > 0) {
              setTimeout(() => {
                parentItems[0].focus();
              }, 50);
            }
          }
          break;
        }
        case "ArrowRight": {
          if (menuContext?.parentContext) {
            menuContext.isOpenSig.value = true;

            const submenuItems = await menuContext.getEnabledItems();
            if (submenuItems.length > 0) {
              setTimeout(() => {
                submenuItems[0].focus();
              }, 50);
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
