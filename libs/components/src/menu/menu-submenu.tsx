import {
  $,
  Slot,
  component$,
  useContext,
  useContextProvider,
  useId,
  useSignal,
  useStyles$,
  useTask$
} from "@builder.io/qwik";
import { useBindings } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { PopoverRootBase } from "../popover/popover-root";
import { type ItemRef, type SubmenuState, menuContextId } from "./menu-context";
import type { PublicMenuRootProps } from "./menu-root";
import { submenuContextId } from "./menu-submenu-context";
import menuSubmenuStyles from "./menu-submenu.css?inline";
import { getEnabledItemsUtil } from "./utils";

export type PublicMenuSubmenuProps = PublicMenuRootProps & {
  /** The position of the submenu relative to its trigger */
  position?: "right" | "left" | "bottom" | "top";
};

/** A component that renders a submenu */
export const MenuSubmenuBase = component$<PublicMenuSubmenuProps>((props) => {
  useStyles$(menuSubmenuStyles);
  const context = useContext(menuContextId);
  const parentContext = useContext(submenuContextId, null);
  const itemRefs = useSignal<ItemRef[]>([]);
  const submenuRef = useSignal<HTMLElement>();

  const { openSig: isOpenSig } = useBindings(props, {
    open: false
  });

  const id = useId();

  const triggerId = useSignal(`${id}-menu-submenu-trigger`);
  const contentId = useSignal(`${id}-menu-submenu-content`);

  const currentLevel = parentContext?.level ? parentContext.level + 1 : 1;

  const parentId = parentContext ? parentContext.contentId : context.contentId;
  const getEnabledItems = $(() => {
    return getEnabledItemsUtil(itemRefs.value, submenuRef.value);
  });

  const submenu: SubmenuState = {
    triggerId: triggerId.value,
    contentId: contentId.value,
    position: props.position ?? "right",
    isOpenSig,
    disabled: false,
    parentId,
    itemRefs,
    getEnabledItems
  };

  // Provide IDs to children through context
  useContextProvider(submenuContextId, {
    triggerId: triggerId.value,
    contentId: contentId.value,
    level: currentLevel,
    parentId: parentId
  });

  useTask$(function registerSubmenu() {
    context.submenus.value = [...context.submenus.value, submenu];
  });

  useTask$(function onClose() {});

  const { open: _o, "bind:open": _bo, ...rest } = props;

  return (
    <PopoverRootBase
      bind:open={isOpenSig}
      data-qds-menu-submenu
      qds-submenu-level={currentLevel}
      tabIndex={-1}
      ref={submenuRef}
      {...rest}
    >
      <Slot />
    </PopoverRootBase>
  );
});

export const MenuSubmenu = withAsChild(MenuSubmenuBase);
