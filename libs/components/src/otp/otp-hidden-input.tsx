// File: otp-native-input.tsx
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
  /**
   * Regex pattern for input validation. Set to null to disable pattern validation.
   * @defaultValue `'^\\d*$'`
   */
  pattern?: string | null;
  /**
   * Callback fired when the OTP is complete
   */
  onComplete$?: () => void;
};

export const OtpHiddenInput = component$((props: OtpNativeInputProps) => {
  const context = useContext(OTPContextId);
  const previousValue = useSignal<string>("");
  const shiftKeyDown = useSignal(false);

  const updateSelection = $(() => {
    const input = context.nativeInputRef.value;
    if (!input || document.activeElement !== input) {
      context.selectionStartSig.value = null;
      context.selectionEndSig.value = null;
      return;
    }

    // Aliases
    const _s = input.selectionStart;
    const _e = input.selectionEnd;
    const _dir = input.selectionDirection;
    const _ml = context.numItemsSig.value;
    const _val = input.value;
    const prevStart = context.selectionStartSig.value;
    const prevEnd = context.selectionEndSig.value;

    if (_val.length === 0 || _s === null || _e === null) {
      return;
    }

    const isSingleCaret = _s === _e;
    const isInsertMode = _s === _val.length && _val.length < _ml;

    let start: number | undefined = undefined;
    let end: number | undefined = undefined;
    let direction: "none" | "forward" | "backward" = "none";

    if (isSingleCaret && !isInsertMode) {
      if (_s === 0) {
        start = 0;
        end = 1;
        direction = "forward";
      } else if (_s === _ml) {
        start = _s - 1;
        end = _s;
        direction = "backward";
      } else if (_ml > 1 && _val.length > 1) {
        let offset = 0;
        if (prevStart !== null && prevEnd !== null) {
          direction = _s < prevEnd ? "backward" : "forward";
          const wasPreviouslyInserting = prevStart === prevEnd && prevStart < _ml;
          if (direction === "backward" && !wasPreviouslyInserting) {
            offset = -1;
          }
        }
        start = offset + _s;
        end = offset + _s + 1;
      }
    }

    // Handle range selection with shift key
    if (shiftKeyDown.value && !isSingleCaret) {
      start = _s;
      end = _e;
      direction = _dir ?? "none";
    }

    if (start !== undefined && end !== undefined && start !== end) {
      input.setSelectionRange(start, end, direction);
    }

    // Update selection range in context
    context.selectionStartSig.value = start ?? _s;
    context.selectionEndSig.value = end ?? _e;
    context.currIndexSig.value = start ?? _s;
  });

  useOnDocument("selectionchange", updateSelection);

  const handleInput = $((event: InputEvent) => {
    const input = event.target as HTMLInputElement;
    const newValue = input.value.slice(0, context.numItemsSig.value);
    const oldValue = context.inputValueSig.value;

    // Get pattern regex
    const pattern = props.pattern ?? "^\\d*$";
    const regexp = new RegExp(pattern);

    if (newValue.length > 0 && regexp && !regexp.test(newValue)) {
      event.preventDefault();
      input.value = oldValue;
      return;
    }

    const isDeleting = newValue.length < oldValue.length;
    let currentPos = isDeleting
      ? input.selectionStart ?? Math.max(newValue.length - 1, 0)
      : newValue.length;

    context.inputValueSig.value = newValue;
    context.currIndexSig.value = currentPos;

    // Update selection to maintain position during deletion or advance during input
    input.setSelectionRange(currentPos, currentPos);
    context.selectionStartSig.value = currentPos;
    context.selectionEndSig.value = currentPos;

    // Check for completion
    if (
      previousValue.value.length < context.numItemsSig.value &&
      newValue.length === context.numItemsSig.value
    ) {
      props.onComplete$?.();
    }
    previousValue.value = newValue;
  });

  const handleKeyDown = $((event: KeyboardEvent) => {
    const input = event.target as HTMLInputElement;
    if (event.key === "Shift") {
      shiftKeyDown.value = true;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const currentPos = context.currIndexSig.value;
      const newPos =
        event.key === "ArrowLeft"
          ? Math.max(0, currentPos - 1)
          : Math.min(context.numItemsSig.value - 1, currentPos + 1);

      context.currIndexSig.value = newPos;
      context.selectionStartSig.value = newPos;
      context.selectionEndSig.value = newPos;
      input.setSelectionRange(newPos, newPos);
    }
  });

  const handleKeyUp = $((event: KeyboardEvent) => {
    if (event.key === "Shift") {
      shiftKeyDown.value = false;
    }
  });

  const handleFocus = $(() => {
    const input = context.nativeInputRef.value;
    if (!input) {
      return;
    }

    context.isFocusedSig.value = true;

    // Set initial selection to first empty position
    const currentValue = input.value;
    let pos = 0;
    while (pos < currentValue.length && currentValue[pos]) {
      pos++;
    }

    input.setSelectionRange(pos, pos);
    context.selectionStartSig.value = pos;
    context.selectionEndSig.value = pos;
    context.currIndexSig.value = pos;
  });

  const handleBlur = $(() => {
    context.isFocusedSig.value = false;
    shiftKeyDown.value = false;
    updateSelection();
  });

  const handlePaste = $((event: ClipboardEvent) => {
    const input = context.nativeInputRef.value;
    const content = event.clipboardData?.getData("text/plain") ?? "";

    if (!input || content === "") {
      return;
    }

    event.preventDefault();

    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const isReplacing = start !== end;

    const currentValue = context.inputValueSig.value;
    const newValueUncapped = isReplacing
      ? currentValue.slice(0, start) + content + currentValue.slice(end)
      : currentValue.slice(0, start) + content + currentValue.slice(start);

    const newValue = newValueUncapped.slice(0, context.numItemsSig.value);

    // Validate against pattern
    const pattern = props.pattern ?? "^\\d*$";
    const regexp = new RegExp(pattern);
    if (newValue.length > 0 && regexp && !regexp.test(newValue)) {
      return;
    }

    input.value = newValue;
    context.inputValueSig.value = newValue;
    context.currIndexSig.value = newValue.length;

    const _start = Math.min(newValue.length, context.numItemsSig.value - 1);
    const _end = newValue.length;

    input.setSelectionRange(_start, _end);
  });

  return (
    <input
      {...props}
      ref={context.nativeInputRef}
      data-qds-otp-hidden-input
      value={context.inputValueSig.value}
      inputMode="numeric"
      pattern={props.pattern ?? "^\\d*$"}
      autoComplete={props.autoComplete || "one-time-code"}
      onFocus$={[handleFocus, props.onFocus$]}
      onBlur$={[handleBlur, props.onBlur$]}
      onInput$={[handleInput, props.onInput$]}
      onKeyDown$={[handleKeyDown, props.onKeyDown$]}
      onKeyUp$={[handleKeyUp, props.onKeyUp$]}
      onPaste$={handlePaste}
      maxLength={context.numItemsSig.value}
    />
  );
});
