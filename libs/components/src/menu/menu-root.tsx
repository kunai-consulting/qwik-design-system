import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import {
  $,
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  sync$,
  useContextProvider,
  useId,
  useOnWindow,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { PopoverRoot } from "../popover/popover-root";

export type ItemRef = {
  ref: Signal;
};

export type MenuContext = {
  /** Whether the menu is open */
  isOpenSig: Signal<boolean>;
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
  /** Root reference to the menu container */
  rootRef: Signal<HTMLElement | undefined>;
  /** Reference to the content element */
  contentRef: Signal<HTMLElement | undefined>;
  /** Reference to the trigger element */
  triggerRef: Signal<HTMLElement | undefined>;
  /** Whether the menu is disabled */
  disabled: Signal<boolean>;
  /** X coordinate for context menu positioning */
  contextMenuX?: Signal<number>;
  /** Y coordinate for context menu positioning */
  contextMenuY?: Signal<number>;
  /** Whether the menu was opened via context menu */
  isContextMenu?: Signal<boolean>;
  /** The function to call when an item is selected */
  onItemSelection$: (value: string) => void;
  /** The direction to focus on when the menu is opened */
  openFocusDirection: Signal<"first" | "last" | undefined>;
};

export const menuContextId = createContextId<MenuContext>("menu-context");

type MenuRootBaseProps = PropsOf<typeof PopoverRoot>;

/** Initial open state of the menu */
export type PublicMenuRootProps = Omit<MenuRootBaseProps, "onChange$"> &
  BindableProps<{
    open: boolean;
    disabled: boolean;
  }> & {
    onOpenChange$?: (open: boolean) => void;
    onChange$?: (value: string) => void;
  };

/** Root container component for the menu */
export const MenuRoot = component$<PublicMenuRootProps>((props) => {
  const { openSig: isOpenSig, disabledSig: isDisabledSig } = useBindings(props, {
    open: false,
    disabled: false
  });
  const rootRef = useSignal<HTMLDivElement>();
  const currentFocusEl = useSignal<HTMLElement>();
  const itemRefs = useSignal<ItemRef[]>([]);
  const isContextMenu = useSignal(false);
  const contextMenuX = useSignal(0);
  const contextMenuY = useSignal(0);
  const contentRef = useSignal<HTMLElement>();
  const triggerRef = useSignal<HTMLElement>();
  const openFocusDirection = useSignal<"first" | "last" | undefined>(undefined);

  const handleItemSelection = $((value: string) => {
    props.onChange$?.(value);
  });

  const isInitialRenderSig = useSignal(true);

  useTask$(({ track }) => {
    track(() => isOpenSig.value);
    if (!isOpenSig.value) {
      isContextMenu.value = false;
      contextMenuX.value = 0;
      contextMenuY.value = 0;
    }
  });

  useTask$(({ track, cleanup }) => {
    const isOpen = track(() => isOpenSig.value);

    if (!isInitialRenderSig.value && props.onOpenChange$) {
      props.onOpenChange$(isOpen);
    }

    cleanup(() => {
      isInitialRenderSig.value = false;
    });
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
    rootRef,
    contentRef,
    triggerRef,
    currentFocusEl,
    itemRefs,
    contextMenuX: contextMenuX,
    contextMenuY: contextMenuY,
    isContextMenu: isContextMenu,
    onItemSelection$: handleItemSelection,
    disabled: isDisabledSig,
    openFocusDirection
  };

  useContextProvider(menuContextId, context);

  const { open: _o, "bind:open": _bo, onChange$: _oc, ...rest } = props;

  return (
    <PopoverRoot bind:open={isOpenSig} data-qds-menu-root ref={rootRef} {...rest}>
      <Slot />
    </PopoverRoot>
  );
});
