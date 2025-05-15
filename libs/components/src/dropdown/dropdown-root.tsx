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
  useTask$
} from "@builder.io/qwik";
import {
  type BindableProps,
  resetIndexes,
  useBindings
} from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { PopoverRootBase } from "../popover/popover-root";
import {
  type DropdownContext,
  type SubmenuState,
  dropdownContextId
} from "./dropdown-context";

type DropdownRootBaseProps = PropsOf<typeof PopoverRootBase>;

/** Initial open state of the dropdown */
export type PublicDropdownRootProps = DropdownRootBaseProps &
  BindableProps<{
    /** Initial open state of the dropdown */
    open: boolean;
  }> & {
    /** Callback fired when dropdown open state changes */
    onOpenChange$?: (open: boolean) => void;
  };

interface ItemRef {
  ref: Signal;
}

/** Root container component for the dropdown menu */
export const DropdownRootBase = component$<PublicDropdownRootProps>((props) => {
  const { openSig: isOpenSig } = useBindings(props, {
    open: false
  });
  const submenus = useSignal<SubmenuState[]>([]);
  const rootRef = useSignal<HTMLDivElement>();
  const currentFocusEl = useSignal<HTMLElement>();

  const closeAllSubmenus = $(() => {
    for (const submenu of submenus.value) {
      submenu.isOpenSig.value = false;
    }
  });

  const isInitialRenderSig = useSignal(true);

  useTask$(async ({ track, cleanup }) => {
    const isOpen = track(() => isOpenSig.value);

    if (!isOpen) {
      closeAllSubmenus();
    }

    if (!isInitialRenderSig.value && props.onOpenChange$) {
      await props.onOpenChange$(isOpen);
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
      const isWithinDropdown = activeElement?.closest("[data-qds-popover-root]");

      if (!isWithinDropdown) return;

      const preventKeys = ["ArrowUp", "ArrowDown", " ", "Home", "End", "ArrowRight"];
      if (preventKeys.includes(event.key)) {
        event.preventDefault();
      }
    })
  );

  const id = useId();
  const contentId = `${id}-content`;
  const triggerId = `${id}-trigger`;

  const context: DropdownContext = {
    isOpenSig,
    contentId,
    triggerId,
    submenus,
    rootRef,
    currentFocusEl
  };

  useContextProvider(dropdownContextId, context);

  const { open: _o, "bind:open": _bo, ...rest } = props;

  return (
    <PopoverRootBase
      tabIndex={-1}
      bind:open={isOpenSig}
      data-qds-dropdown-root
      ref={rootRef}
      {...rest}
    >
      <Slot />
    </PopoverRootBase>
  );
});

export const DropdownRoot = withAsChild(DropdownRootBase, (props) => {
  resetIndexes("dropdown");
  return props;
});
