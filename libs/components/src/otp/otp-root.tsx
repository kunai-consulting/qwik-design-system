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
    "bind:value": givenValueBind,
    onChange$,
    onComplete$,
    disabled = false,
    shiftPWManagers = true,
    ...rest
  } = props;

  useStyles$(styles);

  // The OTP code value
  const code = useBoundSignal<string>(givenValueBind, props.value || "");

  const itemIds = useSignal<string[]>([]);
  const currIndex = useSignal(0);
  const nativeInputRef = useSignal<HTMLInputElement>();
  const isFocused = useSignal(false);
  const isDisabled = useComputed$(() => props.disabled);
  const selectionStart = useSignal<number | null>(null);
  const selectionEnd = useSignal<number | null>(null);
  const isInitialLoad = useSignal(true);
  const hasBeenFocused = useSignal(false);

  itemIds.value = [];

  const context = {
    code,
    currIndex,
    nativeInputRef,
    itemIds,
    hasBeenFocused,
    isFocused,
    isDisabled,
    selectionStart,
    selectionEnd,
    shiftPWManagers
  };

  useTask$(async ({ track }) => {
    track(code);

    if (!isInitialLoad.value) {
      await onChange$?.(code.value);
    }

    isInitialLoad.value = false;

    const isPopulated = code.value.length > 0;
    const isFull = code.value.length === context.itemIds.value.length;

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
      data-disabled={isDisabled.value ? "" : undefined}
      {...rest}
    >
      <Slot />
    </div>
  );
});
