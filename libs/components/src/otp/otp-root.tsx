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

type OtpRootProps = Omit<PropsOf<"div">, "onChange$"> & {
  "bind:value"?: Signal<string>;
  _numItems?: number;
  autoComplete?: HTMLInputAutocompleteAttribute;
  onComplete$?: QRL<() => void>;
  onChange$?: QRL<(value: string) => void>;
  value?: string;
  disabled?: boolean;
};

export const OtpRoot = ({ children, ...props }: OtpRootProps) => {
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

export const OtpBase = component$((props: OtpRootProps) => {
  const { "bind:value": givenValueSig, onChange$, onComplete$, ...rest } = props;

  useStyles$(styles);

  const inputValueSig = useBoundSignal<string>(givenValueSig, props.value || "");
  const currIndexSig = useSignal(0);
  const nativeInputRef = useSignal<HTMLInputElement>();
  const numItemsSig = useComputed$(() => props._numItems || 0);
  const isFocusedSig = useSignal(false);
  const isDisabledSig = useComputed$(() => props.disabled);
  const selectionStartSig = useSignal<number | null>(null);
  const selectionEndSig = useSignal<number | null>(null);

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

    await onChange$?.(inputValueSig.value);

    if (inputValueSig.value.length !== numItemsSig.value) return;

    await onComplete$?.();
  });

  useContextProvider(OTPContextId, context);
  return (
    <div data-qds-otp-root data-disabled={isDisabledSig.value ? "" : undefined} {...rest}>
      <Slot />
    </div>
  );
});
