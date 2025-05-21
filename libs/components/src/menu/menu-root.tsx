import {
  $,
  type PropsOf,
  type Signal,
  Slot,
  component$,
  sync$,
  useContextProvider,
  useId,
  useOnWindow,
  useSignal,
  useTask$,
  type QRL,
  createContextId
} from "@builder.io/qwik";
import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { PopoverRootBase } from "../popover/popover-root";
import { getEnabledItemsUtil } from "./utils";

export type ItemRef = {
  ref: Signal;
};

export type MenuPosition = "right" | "left" | "bottom" | "top";

export type MenuContext = {
  /** Whether the menu is open */
  isOpenSig: Signal<boolean>;
  /** The submenus in the menu */
  nestedMenus: Signal<MenuContext[]>;
  /** ID of the menu content element */
  contentId: string;
  /** ID of the menu trigger element */
  triggerId: string;
  /** The parent menu */
  parentContext?: MenuContext;
  /** The item refs of the menu */
  itemRefs: Signal<ItemRef[]>;
  /** The currently focused element within the menu */
  currentFocusEl: Signal<HTMLElement | undefined>;
  /** Get the enabled items of the menu */
  getEnabledItems: QRL<() => HTMLElement[]>;
  /** Root reference to the menu container */
  rootRef: Signal<HTMLElement | undefined>;
  /** The position of the menu */
  position?: MenuPosition;
  /** X coordinate for context menu positioning */
  contextMenuX?: number;
  /** Y coordinate for context menu positioning */
  contextMenuY?: number;
  /** Whether the menu was opened via context menu */
  isContextMenu?: boolean;
  /** Reference to the content element */
  contentRef: Signal<HTMLElement | undefined>;
};

export const menuContextId = createContextId<MenuContext>("menu-context");

type MenuRootBaseProps = PropsOf<typeof PopoverRootBase>;

/** Initial open state of the menu */
export type PublicMenuRootProps = MenuRootBaseProps &
  BindableProps<{
    open: boolean;
    disabled: boolean;
  }> & {
    onOpenChange$?: (open: boolean) => void;
  };

/** Root container component for the menu */
const MenuRootBase = component$<PublicMenuRootProps>((props) => {
  const { openSig: isOpenSig, disabledSig: isDisabledSig } = useBindings(props, {
    open: false,
    disabled: false
  });
  const nestedMenus = useSignal<MenuContext[]>([]);
  const rootRef = useSignal<HTMLDivElement>();
  const currentFocusEl = useSignal<HTMLElement>();
  const itemRefs = useSignal<ItemRef[]>([]);
  const isContextMenu = useSignal(false);
  const contextMenuX = useSignal(0);
  const contextMenuY = useSignal(0);
  const contentRef = useSignal<HTMLElement>();

  const isInitialRenderSig = useSignal(true);

  useTask$(({ track }) => {
    track(() => isOpenSig.value);
    if (!isOpenSig.value) {
      isContextMenu.value = false;
      contextMenuX.value = 0;
      contextMenuY.value = 0;
    }
  });

  useTask$(async ({ track, cleanup }) => {
    const isOpen = track(() => isOpenSig.value);

    if (!isInitialRenderSig.value && props.onOpenChange$) {
      await props.onOpenChange$(isOpen);
    }

    cleanup(() => {
      isInitialRenderSig.value = false;
    });
  });

  const getEnabledItems = $(() => {
    return getEnabledItemsUtil(itemRefs.value, contentRef.value);
  });

  useOnWindow(
    "keydown",
    sync$((event: KeyboardEvent) => {
      // we have to do this on a window event due to v1 serialization issues
      const activeElement = document.activeElement;
      const isWithinMenu = activeElement?.closest("[data-qds-popover-root]");

      if (!isWithinMenu) return;

      const preventKeys = ["ArrowUp", "ArrowDown", " ", "Home", "End", "ArrowRight"];
      if (preventKeys.includes(event.key)) {
        event.preventDefault();
      }
    })
  );

  const id = useId();
  const contentId = `${id}-content`;
  const triggerId = `${id}-trigger`;

  const context: MenuContext = {
    isOpenSig,
    contentId,
    triggerId,
    nestedMenus,
    rootRef,
    currentFocusEl,
    itemRefs,
    getEnabledItems,
    contextMenuX: contextMenuX.value,
    contextMenuY: contextMenuY.value,
    isContextMenu: isContextMenu.value,
    contentRef
  };

  useContextProvider(menuContextId, context);

  const { open: _o, "bind:open": _bo, ...rest } = props;

  return (
    <PopoverRootBase bind:open={isOpenSig} data-qds-menu-root ref={rootRef} {...rest}>
      <Slot />
    </PopoverRootBase>
  );
});

export const MenuRoot = withAsChild(MenuRootBase);
