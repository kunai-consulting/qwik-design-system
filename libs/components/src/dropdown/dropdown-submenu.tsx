import {
  Slot,
  component$,
  useContext,
  useTask$,
  useContextProvider,
  useSignal,
  useId,
  useStyles$,
  type Signal,
  $
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverRootBase } from "../popover/popover-root";
import { dropdownContextId } from "./dropdown-context";
import { submenuContextId } from "./dropdown-submenu-context";
import type { PublicDropdownRootProps } from "./dropdown-root";
import { useBindings } from "@kunai-consulting/qwik-utils";
import dropdownSubmenuStyles from "./dropdown-submenu.css?inline";
import { getEnabledItems as getEnabledItemsUtil } from "./utils";

export type PublicDropdownSubmenuProps = PublicDropdownRootProps & {
  /** The position of the submenu relative to its trigger */
  position?: "right" | "left" | "bottom" | "top";
};

interface ItemRef {
  ref: Signal;
}

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

  // Provide IDs to children through context
  useContextProvider(submenuContextId, {
    triggerId: triggerId.value,
    contentId: contentId.value,
    level: currentLevel
  });

  const getEnabledItems = $(() => getEnabledItemsUtil(itemRefs.value));

  useTask$(function registerSubmenu() {
    context.submenus.value = [
      ...context.submenus.value,
      {
        triggerId: triggerId.value,
        contentId: contentId.value,
        position: props.position ?? "right",
        isOpenSig: isOpenSig,
        disabled: false,
        itemRefs: itemRefs,
        getEnabledItems: getEnabledItems,
        parentId: parentContext ? parentContext.contentId : context.contentId
      }
    ];
  });

  useTask$(function onClose() {});

  const { open: _o, "bind:open": _bo, ...rest } = props;

  return (
    <PopoverRootBase
      bind:open={isOpenSig}
      {...rest}
      data-qds-dropdown-submenu
      qds-submenu-level={currentLevel}
    >
      <Slot />
    </PopoverRootBase>
  );
});

export const DropdownSubmenu = withAsChild(DropdownSubmenuBase);
