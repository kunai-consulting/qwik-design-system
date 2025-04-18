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
  useStyles$,
  useTask$
} from "@builder.io/qwik";
import { type BindableProps, useBindings } from "../../utils/bindings";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { type SwitchContext, switchContextId } from "./switch-context";
import styles from "./switch.css?inline";

type SwitchBinds = {
  /** Initial checked state of the switch */
  checked: boolean;
  /** Whether the switch is disabled */
  disabled: boolean;
  /** Whether the switch is required */
  required: boolean;
  /** Name attribute for the hidden input element */
  name?: string;
  /** Value attribute for the hidden input element */
  value?: string;
};

type PublicRootProps = PropsOf<"div"> & {
  /** Callback when the switch state changes */
  onChange$?: (checked: boolean) => void;
  /** Whether the switch is in an error state */
  isError?: boolean;
} & BindableProps<SwitchBinds>;

/** Root component that manages the switch state and context */
const SwitchRootBase = component$<PublicRootProps>((props) => {
  useStyles$(styles);
  const { onChange$, isError, ...restProps } = props;

  const { checkedSig, disabledSig, requiredSig, nameSig, valueSig } =
    useBindings<SwitchBinds>(props, {
      checked: false,
      disabled: false,
      required: false,
      name: "",
      value: ""
    });

  // Track changes to checkedSig and call onChange$
  useTask$(({ track }) => {
    const checked = track(() => checkedSig.value);
    if (onChange$ && !disabledSig.value) {
      onChange$(checked);
    }
  });

  // Prevent default behavior for Space and Enter keys at window level
  useOnWindow(
    "keydown",
    sync$((event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isWithinSwitch = activeElement?.closest("[data-qds-switch-trigger]");

      if (!isWithinSwitch) return;

      const preventKeys = [" ", "Enter"];
      if (preventKeys.includes(event.key)) {
        event.preventDefault();
      }
    })
  );

  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const labelId = `${baseId}-label`;
  const descriptionId = `${baseId}-description`;
  const errorId = `${baseId}-error`;

  const context: SwitchContext = {
    checked: checkedSig,
    disabled: disabledSig,
    required: requiredSig,
    name: nameSig as Signal<string> | undefined,
    value: valueSig as Signal<string> | undefined,
    onChange$: onChange$,
    toggle$: $(() => {
      if (!disabledSig.value) {
        checkedSig.value = !checkedSig.value;
      }
    }),
    triggerId,
    labelId,
    descriptionId,
    errorId,
    isError
  };

  useContextProvider(switchContextId, context);

  return (
    <Render
      {...restProps}
      fallback="div"
      role="switch"
      aria-checked={checkedSig.value}
      aria-disabled={disabledSig.value}
      aria-required={requiredSig.value}
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      aria-errormessage={isError ? errorId : undefined}
      data-qds-switch-root
      // Indicates whether the switch is currently checked
      data-checked={checkedSig.value}
      // Indicates whether the switch is currently disabled
      data-disabled={disabledSig.value}
      // Indicates whether the switch is in an error state
      data-error={isError ? "" : undefined}
      onChange$={[onChange$, props.onChange$]}
    >
      <Slot />
    </Render>
  );
});

export const SwitchRoot = withAsChild(SwitchRootBase);
