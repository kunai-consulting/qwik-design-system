import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import {
  type PropsOf,
  type QRL,
  Slot,
  component$,
  useContext,
  useContextProvider,
  useSignal,
  useStyles$,
  useTask$
} from "@qwik.dev/core";
import { Render } from "../render/render";
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

  const currentIndex = useSignal(0);
  const numItems = 0;
  const nativeInputRef = useSignal<HTMLInputElement>();
  const isFocused = useSignal(false);
  const selectionStart = useSignal<number | null>(null);
  const selectionEnd = useSignal<number | null>(null);
  const hasBeenFocused = useSignal(false);

  const context = {
    code,
    currentIndex,
    numItems,
    nativeInputRef,
    hasBeenFocused,
    isFocused,
    isDisabled,
    selectionStart,
    selectionEnd,
    shiftPWManagers
  };

  useContextProvider(OTPContextId, context);

  return (
    <Render
      fallback="div"
      // The identifier for the root OTP input container
      data-qds-otp-root
      // Indicates if the entire OTP input is disabled
      data-disabled={isDisabled.value ? "" : undefined}
      {...rest}
    >
      <Slot />
      <PostRender onComplete$={onComplete$} onChange$={onChange$} />
    </Render>
  );
});

type PostRenderProps = {
  onComplete$: QRL<() => void> | undefined;
  onChange$: QRL<(value: string) => void> | undefined;
};

const PostRender = component$<PostRenderProps>((props: PostRenderProps) => {
  const context = useContext(OTPContextId);
  const isInitialLoad = useSignal(true);

  const { onComplete$, onChange$ } = props;

  useTask$(async ({ track }) => {
    track(context.code);

    if (!isInitialLoad.value) {
      await onChange$?.(context.code.value);
    }

    isInitialLoad.value = false;

    const isPopulated = context.code.value.length > 0;

    // this is in post render because numItems is not updated until the items are rendered
    const isFull = context.code.value.length === context.numItems;

    if (!isPopulated) return;
    if (!isFull) return;

    await onComplete$?.();
  });

  return <></>;
});
