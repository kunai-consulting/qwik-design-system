import {
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useId
} from "@builder.io/qwik";
import { type BindableProps, useBindings } from "../../utils/bindings";
import { withAsChild } from "../as-child/as-child";
import { PopoverRootBase } from "../popover/popover-root";
import { type DropdownContext, dropdownContextId } from "./dropdown-context";

type DropdownRootBaseProps = Omit<
  PropsOf<typeof PopoverRootBase>,
  "id" | "popover" | "open" | "bind:open"
>;

export type DropdownRootProps = DropdownRootBaseProps & BindableProps<{ open: boolean }>;

const DropdownRootBase = component$<DropdownRootProps>((props) => {
  const { openSig: isOpenSig } = useBindings(
    { "bind:open": props["bind:open"], open: props.open },
    {
      open: false
    }
  );
  const id = useId();

  const contentId = `${id}-content`;
  const triggerId = `${id}-trigger`;

  const context: DropdownContext = {
    isOpenSig,
    contentId,
    triggerId
  };

  useContextProvider(dropdownContextId, context);

  const { open: _o, "bind:open": _bo, ...rest } = props;

  return (
    <PopoverRootBase bind:open={isOpenSig} data-qds-dropdown-root {...rest}>
      <Slot />
    </PopoverRootBase>
  );
});

export const DropdownRoot = withAsChild(DropdownRootBase);
