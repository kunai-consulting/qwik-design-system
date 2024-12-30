import {
  type HTMLInputAutocompleteAttribute,
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
} from "@builder.io/qwik";
import { findComponent, processChildren } from "../../utils/inline-component";
import { OTPContextId } from "./otp-context";
import { OtpItem } from "./otp-item";
import styles from "./otp.css?inline";
import { useBoundSignal } from "../../utils/bound-signal";
import { Render, type RenderProps } from "../render/render";

type PublicOtpRootProps = Omit<PropsOf<"div">, "onChange$"> & {
/** Reactive value that can be controlled via signal. Describe what passing their signal does for this bind property */
  "bind:value"?: Signal<string>;
/** Number of OTP input items to display */
  _numItems?: number;
/** HTML autocomplete attribute for the input */
  autoComplete?: HTMLInputAutocompleteAttribute;
/** Event handler for when all OTP items are filled */
  onComplete$?: QRL<() => void>;
/** Event handler for when the OTP value changes */
  onChange$?: QRL<(value: string) => void>;
/** Initial value of the OTP input */
  value?: string;
/** Whether the OTP input is disabled */
  disabled?: boolean;
} & RenderProps;

/** Here's a comment for you! */
/** Root component for OTP input that manages multiple input items */
/** Root component for OTP input that manages multiple input items */
export const OtpRoot = ({ children, ...props }: PublicOtpRootProps) => {
  let currItemIndex = 0;
  let numItems = 0;

  findComponent(OtpItem, (itemProps) => {
    itemProps._index = currItemIndex;
    currItemIndex++;
    numItems = currItemIndex;
  });

  processChildren(children);

  return (
    <OtpBase _numItems={numItems} {...props}>
      {children}
    </OtpBase>
  );
};

/** Base implementation of the OTP root component with context provider */
export const OtpBase = component$((props: PublicOtpRootProps) => {
  const {
    "bind:value": givenValueSig,
    onChange$,
    onComplete$,
    render: Comp,
    disabled = false,
    ...rest
  } = props;

  useStyles$(styles);

  const inputValueSig = useBoundSignal<string>(givenValueSig, props.value || "");
  const currIndexSig = useSignal(0);
  const nativeInputRef = useSignal<HTMLInputElement>();
  const numItemsSig = useComputed$(() => props._numItems || 0);
  const isFocusedSig = useSignal(false);
  const isDisabledSig = useComputed$(() => props.disabled);
  const selectionStartSig = useSignal<number | null>(null);
  const selectionEndSig = useSignal<number | null>(null);
  const isInitialLoadSig = useSignal(true);

  const isLastItemSig = useComputed$(
    () => inputValueSig.value.length === numItemsSig.value
  );

  const context = {
    inputValueSig,
    currIndexSig,
    nativeInputRef,
    numItemsSig,
    isLastItemSig,
    isFocusedSig,
    isDisabledSig,
    selectionStartSig,
    selectionEndSig
  };

  useTask$(async function handleChange({ track }) {
    track(() => inputValueSig.value);

    if (!isInitialLoadSig.value) {
      await onChange$?.(inputValueSig.value);
    }

    isInitialLoadSig.value = false;

    if (inputValueSig.value.length !== numItemsSig.value) return;

    await onComplete$?.();
  });

  useContextProvider(OTPContextId, context);

  return (
    <Render
      component={Comp}
      fallback="div"
// The identifier for the root OTP input container
      data-qds-otp-root
// Indicates if the entire OTP input is disabled
      data-disabled={isDisabledSig.value ? "" : undefined}
      {...rest}
    >
      <Slot />
    </Render>
  );
});
