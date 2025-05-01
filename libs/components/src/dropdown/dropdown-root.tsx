import {
  type PropsOf,
  type Signal,
  Slot,
  component$,
  sync$,
  useContextProvider,
  useId,
  useOnWindow,
  useSignal
} from "@builder.io/qwik";
import {
  type BindableProps,
  resetIndexes,
  useBindings
} from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { PopoverRootBase } from "../popover/popover-root";
import { type DropdownContext, dropdownContextId } from "./dropdown-context";

type DropdownRootBaseProps = Omit<
  PropsOf<typeof PopoverRootBase>,
  /** Reactive value that controls whether the dropdown is open */
  "id" | "popover" | "open" | "bind:open"
>;

/** Initial open state of the dropdown */
export type PublicDropdownRootProps = DropdownRootBaseProps &
  BindableProps<{
    open: boolean;
  }>;

interface ItemRef {
  ref: Signal;
}

/** Root container component for the dropdown menu */
const DropdownRootBase = component$<PublicDropdownRootProps>((props) => {
  const { openSig: isOpenSig } = useBindings(
    { "bind:open": props["bind:open"], open: props.open },
    {
      open: false
    }
  );

  useOnWindow(
    "keydown",
    sync$((event: KeyboardEvent) => {
      // we have to do this on a window event due to v1 serialization issues
      const activeElement = document.activeElement;
      const isWithinDropdown = activeElement?.closest("[data-qds-dropdown-root]");

      if (!isWithinDropdown) return;

      const preventKeys = ["ArrowUp", "ArrowDown"];
      if (preventKeys.includes(event.key)) {
        event.preventDefault();
      }
    })
  );

  const id = useId();

  const contentId = `${id}-content`;
  const triggerId = `${id}-trigger`;
  const itemRefs = useSignal<ItemRef[]>([]);

  const context: DropdownContext = {
    isOpenSig,
    contentId,
    triggerId,
    itemRefs
  };

  useContextProvider(dropdownContextId, context);

  const { open: _o, "bind:open": _bo, ...rest } = props;

  return (
    // The identifier for the root dropdown container
    <PopoverRootBase bind:open={isOpenSig} data-qds-dropdown-root {...rest}>
      <Slot />
    </PopoverRootBase>
  );
});

export const DropdownRoot = withAsChild(DropdownRootBase, (props) => {
  resetIndexes("dropdown");
  return props;
});
