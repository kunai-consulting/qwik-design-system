import {
  Slot,
  component$,
  useContext,
  useContextProvider,
  useId,
  useSignal,
  useStyles$
} from "@qwik.dev/core";
import { useBindings } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { PopoverRootBase } from "../popover/popover-root";
import { type ItemRef, type MenuContext, menuContextId } from "./menu-root";
import type { PublicMenuRootProps } from "./menu-root";
import menuSubmenuStyles from "./menu-submenu.css?inline";

export type PublicMenuSubmenuProps = PublicMenuRootProps & {
  /** The position of the submenu relative to its trigger */
  position?: "right" | "left" | "bottom" | "top";
};

/** A component that renders a submenu */
export const MenuSubmenuBase = component$<PublicMenuSubmenuProps>((props) => {
  useStyles$(menuSubmenuStyles);

  const parentContext = useContext(menuContextId);
  const itemRefs = useSignal<ItemRef[]>([]);
  const submenuRef = useSignal<HTMLElement>();
  const contentRef = useSignal<HTMLElement>();
  const triggerRef = useSignal<HTMLElement>();

  const { openSig: isOpenSig, disabledSig: isDisabledSig } = useBindings(props, {
    open: false,
    disabled: false
  });

  const id = useId();

  const triggerId = `${id}-menu-submenu-trigger`;
  const contentId = `${id}-menu-submenu-content`;

  const menuContext: MenuContext = {
    triggerId,
    contentId,
    position: props.position ?? "right",
    isOpenSig,
    parentContext,
    itemRefs,
    rootRef: submenuRef,
    contentRef,
    triggerRef,
    disabled: isDisabledSig,
    currentFocusEl: parentContext.currentFocusEl,
    onItemSelection$: parentContext.onItemSelection$,
    openFocusDirection: parentContext.openFocusDirection
  };

  useContextProvider(menuContextId, menuContext);

  const { open: _o, "bind:open": _bo, onChange$: _oc, ...rest } = props;

  return (
    <PopoverRootBase
      bind:open={isOpenSig}
      data-qds-menu-submenu
      tabIndex={-1}
      ref={submenuRef}
      {...rest}
    >
      <Slot />
    </PopoverRootBase>
  );
});

export const MenuSubmenu = withAsChild(MenuSubmenuBase);
