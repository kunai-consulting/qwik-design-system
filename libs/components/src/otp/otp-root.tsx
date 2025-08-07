import { useBoundSignal } from "@kunai-consulting/qwik-utils";
import {
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useSignal,
  useStyles$,
  useTask$
} from "@qwik.dev/core";
import { OTPContextId } from "./otp-context";
import styles from "./otp.css?inline";

type PublicOtpRootProps = Omit<PropsOf<"div">, "onChange$"> & {
  /** Reactive value that can be controlled via signal. Describe what passing their signal does for this bind property */
  "bind:value"?: Signal<string>;
  /** Number of OTP input items to display */
  _numItems?: number;
  /** Event handler for when all OTP items are filled */
  onComplete$?: QRL<() => void>;
  /** Event handler for when the OTP value changes */
  onChange$?: QRL<(value: string) => void>;
  /** Initial value of the OTP input */
  value?: string;
  /** Whether the OTP input is disabled */
  disabled?: boolean;
  /** Whether password manager popups should shift to the right of the OTP. By default enabled */
  shiftPWManagers?: boolean;
};

/** Base implementation of the OTP root component with context provider */
export const OtpRoot = component$((props: PublicOtpRootProps) => {
  const {
    "bind:value": givenValueSig,
    onChange$,
    onComplete$,
    disabled = false,
    shiftPWManagers = true,
    ...rest
  } = props;

  useStyles$(styles);

  const currItemIndex = 0;
  const numItems = 0;

  const inputValueSig = useBoundSignal<string>(givenValueSig, props.value || "");
  const currIndexSig = useSignal(0);
  const nativeInputRef = useSignal<HTMLInputElement>();
  const isFocusedSig = useSignal(false);
  const isDisabledSig = useComputed$(() => props.disabled);
  const selectionStartSig = useSignal<number | null>(null);
  const selectionEndSig = useSignal<number | null>(null);
  const isInitialLoadSig = useSignal(true);

  const context = {
    inputValueSig,
    currIndexSig,
    nativeInputRef,
    numItems,
    isFocusedSig,
    isDisabledSig,
    selectionStartSig,
    selectionEndSig,
    shiftPWManagers,
    currItemIndex
  };

  useTask$(async function handleChange({ track }) {
    track(() => inputValueSig.value);

    if (!isInitialLoadSig.value) {
      await onChange$?.(inputValueSig.value);
    }

    isInitialLoadSig.value = false;

    const isPopulated = inputValueSig.value.length > 0;
    const isFull = inputValueSig.value.length === context.numItems;

    if (!isPopulated) return;
    if (!isFull) return;

    await onComplete$?.();
  });

  useContextProvider(OTPContextId, context);

  return (
    <div
      // The identifier for the root OTP input container
      data-qds-otp-root
      // Indicates if the entire OTP input is disabled
      data-disabled={isDisabledSig.value ? "" : undefined}
      {...rest}
    >
      <Slot />
    </div>
  );
});
