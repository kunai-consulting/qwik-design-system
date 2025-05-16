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
import { type ItemRef, type SubmenuState, dropdownContextId } from "./dropdown-context";
import type { PublicDropdownRootProps } from "./dropdown-root";
import { submenuContextId } from "./dropdown-submenu-context";
import dropdownSubmenuStyles from "./dropdown-submenu.css?inline";
import { getEnabledItemsUtil } from "./utils";

export type PublicDropdownSubmenuProps = PublicDropdownRootProps & {
  /** The position of the submenu relative to its trigger */
  position?: "right" | "left" | "bottom" | "top";
};

/** A component that renders a submenu */
export const DropdownSubmenuBase = component$<PublicDropdownSubmenuProps>((props) => {
  useStyles$(dropdownSubmenuStyles);
  const context = useContext(dropdownContextId);
  const parentContext = useContext(submenuContextId, null);
  const itemRefs = useSignal<ItemRef[]>([]);

  const { openSig: isOpenSig } = useBindings(props, {
    open: false
  });

  const id = useId();

  const triggerId = useSignal(`${id}-dropdown-submenu-trigger`);
  const contentId = useSignal(`${id}-dropdown-submenu-content`);

  const currentLevel = parentContext?.level ? parentContext.level + 1 : 1;

  const parentId = parentContext ? parentContext.contentId : context.contentId;
  const getEnabledItems = $(() => {
    return getEnabledItemsUtil(itemRefs.value);
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
      data-qds-dropdown-submenu
      qds-submenu-level={currentLevel}
      tabIndex={-1}
      {...rest}
    >
      <Slot />
    </PopoverRootBase>
  );
});

export const DropdownSubmenu = withAsChild(DropdownSubmenuBase);
