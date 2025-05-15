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

  const triggerId = useSignal(`dropdown-submenu-trigger-${id}`);
  const contentId = useSignal(`dropdown-submenu-content-${id}`);

  // Provide IDs to children through context
  useContextProvider(submenuContextId, {
    triggerId: triggerId.value,
    contentId: contentId.value,
    level: parentContext?.level ? parentContext.level + 1 : 1
  });

  const getEnabledItems = $(() =>
    itemRefs.value
      .map((itemRefObj) => itemRefObj.ref.value)
      .filter((el): el is HTMLElement => {
        if (!el) return false;
        if (el.hasAttribute("data-disabled") || el.hasAttribute("disabled")) return false;
        return true;
      })
  );

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
    <PopoverRootBase bind:open={isOpenSig} {...rest} data-qds-dropdown-submenu>
      <Slot />
    </PopoverRootBase>
  );
});

export const DropdownSubmenu = withAsChild(DropdownSubmenuBase);
