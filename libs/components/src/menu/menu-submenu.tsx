import {
  Slot,
  component$,
  useContext,
  useContextProvider,
  useId,
  useSignal,
  useStyles$
} from "@builder.io/qwik";
import { useBindings } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { PopoverRootBase } from "../popover/popover-root";
import { type ItemRef, menuContextId, type MenuContext } from "./menu-root";
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
  const nestedMenus = useSignal<MenuContext[]>([]);
  const contentRef = useSignal<HTMLElement>();

  const { openSig: isOpenSig } = useBindings(props, {
    open: false
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
    currentFocusEl: parentContext.currentFocusEl,
    nestedMenus: nestedMenus,
    contentRef
  };

  useContextProvider(menuContextId, menuContext);

  const { open: _o, "bind:open": _bo, ...rest } = props;

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
