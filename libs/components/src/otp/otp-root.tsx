import {
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useSignal
} from "@builder.io/qwik";
import { findComponent, processChildren } from "../../utils/inline-component";
import { OTPContextId } from "./otp-context";
import { OtpItem } from "./otp-item";

type OtpRootProps = PropsOf<"div">;

export const OtpRoot = ({ children }: OtpRootProps) => {
  let currItemIndex = 0;

  findComponent(OtpItem, (itemProps) => {
    itemProps._index = currItemIndex;
    currItemIndex++;
  });

  processChildren(children);

  return <OtpBase>{children}</OtpBase>;
};

export const OtpBase = component$((props: OtpRootProps) => {
  const value = useSignal<string | number>("");
  const activeIndex = useSignal(0);
  const nativeInputRef = useSignal<HTMLInputElement>();

  const context = {
    value: value,
    activeIndexSig: activeIndex,
    nativeInputRef: nativeInputRef
  };

  useContextProvider(OTPContextId, context);
  return (
    <div {...props}>
      <Slot />
    </div>
  );
});
