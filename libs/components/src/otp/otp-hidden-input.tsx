import {
  $,
  component$,
  type PropsOf,
  useContext,
  useSignal,
  useOnDocument
} from "@builder.io/qwik";
import { OTPContextId } from "./otp-context";

type OtpNativeInputProps = PropsOf<"input"> & {
  pattern?: string | null;
  onComplete$?: () => void;
};

export const OtpHiddenInput = component$((props: OtpNativeInputProps) => {
  const context = useContext(OTPContextId);
  const previousValue = useSignal<string>("");
  const shiftKeyDown = useSignal(false);

  const previousSelection = useSignal({
    inserting: false,
    start: null as number | null,
    end: null as number | null
  });

  const syncSelection = $(
    (start: number | null, end: number | null, inserting: boolean) => {
      previousSelection.value = {
        inserting,
        start,
        end
      };

      if (start === null || end === null) {
        context.selectionStartSig.value = null;
        context.selectionEndSig.value = null;
        context.currIndexSig.value = null;
        context.isFocusedSig.value = false;
        return;
      }

      context.selectionStartSig.value = start;
      context.selectionEndSig.value = Math.min(end, context.numItemsSig.value);
      context.currIndexSig.value = start;
    }
  );

  const updateSelection = $(() => {
    const input = context.nativeInputRef.value;
    if (!input || document.activeElement !== input) {
      syncSelection(null, null, false);
      return;
    }

    const maxLength = context.numItemsSig.value;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const value = input.value;

    if (value.length === 0 || start === null || end === null) return;

    const setRange = (
      s: number,
      e: number,
      dir?: "forward" | "backward" | "none",
      inserting = false
    ) => {
      input.setSelectionRange(s, e, dir);
      syncSelection(s, e, inserting);
    };

    // insertion mode
    if (value.length < maxLength && start === value.length) {
      setRange(start, end + 1, undefined, true);
      return;
    }

    // range selection
    if (shiftKeyDown.value && start !== end) {
      setRange(start, end, input.selectionDirection ?? "none");
      return;
    }

    // single navigation
    if (start === end) {
      if (start === 0) {
        setRange(0, 1, "forward");
      } else if (start === maxLength) {
        setRange(maxLength - 1, maxLength, "backward");
      } else if (
        previousSelection.value.end !== null &&
        start < previousSelection.value.end
      ) {
        setRange(start - 1, start);
      } else if (shiftKeyDown.value && previousSelection.value.start !== null) {
        setRange(previousSelection.value.start, start + 1);
      } else {
        setRange(start, start + 1);
      }
    }
  });

  useOnDocument("selectionchange", updateSelection);

  const handleInput = $((e: InputEvent) => {
    const input = e.target as HTMLInputElement;
    const newValue = input.value.slice(0, context.numItemsSig.value);

    // validate input if pattern provided
    if (props.pattern && !new RegExp(props.pattern).test(newValue)) {
      input.value = context.inputValueSig.value;
      return;
    }

    const isBackspace = previousValue.value.length > newValue.length;
    const position = isBackspace
      ? Math.min(context.currIndexSig.value ?? 0, newValue.length)
      : Math.min(newValue.length, context.numItemsSig.value);

    context.inputValueSig.value = newValue;
    previousValue.value = newValue;

    // backspacing and not at last filled position, move back
    if (isBackspace && position > 0 && position !== previousValue.value.length) {
      const newPos = position - 1;
      context.currIndexSig.value = newPos;
      context.selectionStartSig.value = newPos;
      context.selectionEndSig.value = newPos + 1;
      input.setSelectionRange(newPos, newPos + 1);
    } else {
      context.currIndexSig.value = position;
      context.selectionStartSig.value = position;
      context.selectionEndSig.value = position + 1;
      input.setSelectionRange(position, position + 1);
    }

    if (newValue.length === context.numItemsSig.value) {
      props.onComplete$?.();
    }
  });

  const handleKeyDown = $((e: KeyboardEvent) => {
    if (e.key === "Shift") {
      shiftKeyDown.value = true;
    }
  });

  const handleKeyUp = $((e: KeyboardEvent) => {
    if (e.key === "Shift") {
      shiftKeyDown.value = false;
    }
  });

  const handleFocus = $((e: FocusEvent) => {
    const input = context.nativeInputRef.value;
    if (!input) return;

    context.isFocusedSig.value = true;
    const pos = context.inputValueSig.value.length;
    input.setSelectionRange(pos, pos);
    syncSelection(pos, pos, false);
  });

  const handleBlur = $(() => {
    shiftKeyDown.value = false;
    context.isFocusedSig.value = false;
    syncSelection(null, null, false);
  });

  return (
    <input
      {...props}
      ref={context.nativeInputRef}
      value={context.inputValueSig.value}
      maxLength={context.numItemsSig.value}
      data-qds-otp-hidden-input
      inputMode="numeric"
      onInput$={[handleInput, props.onInput$]}
      onKeyDown$={[handleKeyDown, props.onKeyDown$]}
      onKeyUp$={[handleKeyUp, props.onKeyUp$]}
      onFocus$={[handleFocus, props.onFocus$]}
      onBlur$={[handleBlur, props.onBlur$]}
    />
  );
});
