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
  // new comment 123!
  "bind:value"?: Signal<string>;
  // here's a comment
  _numItems?: number;
  // here's a comment
  autoComplete?: HTMLInputAutocompleteAttribute;
  // here's a comment
  onComplete$?: QRL<() => void>;
  // here's a comment
  onChange$?: QRL<(value: string) => void>;
  // here's a comment
  value?: string;
  // here's a comment
  disabled?: boolean;
} & RenderProps;

/** Here's a comment for you! */
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
      data-qds-otp-root
      data-disabled={isDisabledSig.value ? "" : undefined}
      {...rest}
    >
      <Slot />
    </Render>
  );
});
