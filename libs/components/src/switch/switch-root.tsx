import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import {
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useId,
  useSignal,
  useStyles$,
  useTask$
} from "@qwik.dev/core";
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
  hasError?: boolean;
} & BindableProps<SwitchBinds>;

/** Root component that manages the switch state and context */
const SwitchRootBase = component$<PublicRootProps>((props) => {
  useStyles$(styles);
  const { onChange$, hasError, ...restProps } = props;
  const isInitialLoadSig = useSignal(true);
  const hasErrorMessageSig = useSignal(false);

  const { checkedSig, disabledSig, requiredSig, nameSig, valueSig } =
    useBindings<SwitchBinds>(props, {
      checked: false,
      disabled: false,
      required: false,
      name: "",
      value: ""
    });

  useTask$(async function handleChange({ track, cleanup }) {
    const checked = track(() => checkedSig.value);

    if (!isInitialLoadSig.value && onChange$ && !disabledSig.value) {
      onChange$(checked);
    }

    cleanup(() => {
      isInitialLoadSig.value = false;
    });
  });

  const localId = useId();
  const labelId = `${localId}-label`;
  const descriptionId = `${localId}-description`;
  const errorId = `${localId}-error`;

  const context: SwitchContext = {
    checked: checkedSig,
    disabled: disabledSig,
    required: requiredSig,
    name: nameSig,
    value: valueSig,
    onChange$,
    localId,
    hasErrorMessage: hasErrorMessageSig,
    hasError
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
      aria-errormessage={hasErrorMessageSig.value ? errorId : undefined}
      data-qds-switch-root
      // Indicates whether the switch is currently checked
      data-checked={checkedSig.value}
      // Indicates whether the switch is currently disabled
      data-disabled={disabledSig.value}
      // Indicates whether the switch is in an error state
      data-error={hasError ? "" : undefined}
      onChange$={[onChange$, props.onChange$]}
    >
      <Slot />
    </Render>
  );
});

export const SwitchRoot = withAsChild(SwitchRootBase);
