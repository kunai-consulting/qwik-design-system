import {
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useSignal,
  useStyles$
} from "@builder.io/qwik";
import { findComponent, processChildren } from "../../utils/inline-component";
import { OTPContextId } from "./otp-context";
import { OtpItem } from "./otp-item";
import styles from "./otp.css?inline";

type OtpRootProps = PropsOf<"div"> & {
  _numItems?: number;
};

export const OtpRoot = ({ children }: OtpRootProps) => {
  let currItemIndex = 0;
  let numItems = 0;

  findComponent(OtpItem, (itemProps) => {
    itemProps._index = currItemIndex;
    currItemIndex++;
    numItems = currItemIndex;
  });

  processChildren(children);

  return <OtpBase _numItems={numItems}>{children}</OtpBase>;
};

export const OtpBase = component$((props: OtpRootProps) => {
  useStyles$(styles);

  const inputValueSig = useSignal<string>("");
  const activeIndex = useSignal(0);
  const nativeInputRef = useSignal<HTMLInputElement>();
  const numItemsSig = useComputed$(() => props._numItems || 0);
  const isFocusedSig = useSignal(false);

  const isLastItemSig = useComputed$(
    () => inputValueSig.value.length === numItemsSig.value
  );

  const context = {
    inputValueSig: inputValueSig,
    activeIndexSig: activeIndex,
    nativeInputRef: nativeInputRef,
    numItemsSig,
    isLastItemSig,
    isFocusedSig
  };

  useContextProvider(OTPContextId, context);
  return (
    <div data-qds-otp-root {...props}>
      <Slot />
    </div>
  );
});
