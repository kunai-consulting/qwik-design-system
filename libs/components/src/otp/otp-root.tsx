import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import {
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useSignal,
  useStyles$,
  useTask$
} from "@qwik.dev/core";
import { OTPContextId } from "./otp-context";
import styles from "./otp.css?inline";

type PublicOtpRootProps = Omit<PropsOf<"div">, "onChange$"> & {
  /** Event handler for when all OTP items are filled */
  onComplete$?: () => void;
  /** Event handler for when the OTP value changes */
  onChange$?: (value: string) => void;
  /** Whether password manager popups should shift to the right of the OTP. By default enabled */
  shiftPWManagers?: boolean;
} & BindableProps<{
    value: string;
    disabled: boolean;
  }>;

/** Base implementation of the OTP root component with context provider */
export const OtpRoot = component$((props: PublicOtpRootProps) => {
  const { onChange$, onComplete$, shiftPWManagers = true, ...rest } = props;

  useStyles$(styles);

  // The OTP code value
  const { valueSig: code, disabledSig: isDisabled } = useBindings(props, {
    value: "",
    disabled: false
  });

  const itemIds = useSignal<string[]>([]);
  const currentIndex = useSignal(0);
  const numItems = 0;
  const nativeInputRef = useSignal<HTMLInputElement>();
  const isFocused = useSignal(false);
  const selectionStart = useSignal<number | null>(null);
  const selectionEnd = useSignal<number | null>(null);
  const isInitialLoad = useSignal(true);
  const hasBeenFocused = useSignal(false);

  itemIds.value = [];

  const context = {
    code,
    currentIndex,
    numItems,
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
