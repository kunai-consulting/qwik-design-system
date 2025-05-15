import {
  Slot,
  component$,
  useContext,
  useTask$,
  useContextProvider,
  useSignal,
  useId,
  useStyles$
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

/** A component that renders a submenu */
export const DropdownSubmenuBase = component$<PublicDropdownSubmenuProps>((props) => {
  useStyles$(dropdownSubmenuStyles);
  const context = useContext(dropdownContextId);
  const parentContext = useContext(submenuContextId, null);
  const rootRef = useSignal<HTMLElement>();

  const { openSig: isOpenSig } = useBindings(props, {
    open: false
  });

  const id = useId();

  const triggerId = useSignal(`${id}-dropdown-submenu-trigger`);
  const contentId = useSignal(`${id}-dropdown-submenu-content`);

  const currentLevel = parentContext?.level ? parentContext.level + 1 : 1;
  const parentRef = parentContext ? rootRef : context.rootRef;
  const parentId = parentContext ? parentContext.contentId : context.contentId;

  // Provide IDs to children through context
  useContextProvider(submenuContextId, {
    triggerId: triggerId.value,
    contentId: contentId.value,
    level: currentLevel,
    parentRef: parentRef,
    parentId: parentId
  });

  useTask$(function registerSubmenu() {
    context.submenus.value = [
      ...context.submenus.value,
      {
        triggerId: triggerId.value,
        contentId: contentId.value,
        position: props.position ?? "right",
        isOpenSig: isOpenSig,
        disabled: false,
        parentId: parentContext ? parentContext.contentId : context.contentId,
        rootRef: rootRef
      }
    ];
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
