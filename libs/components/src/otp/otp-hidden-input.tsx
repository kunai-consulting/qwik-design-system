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

  // Track selection state for mirroring
  const inputMetadata = {
    prev: [null, null, "none"] as [
      number | null,
      number | null,
      "none" | "forward" | "backward"
    ]
  };

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
    const _prev = inputMetadata.prev;

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
        if (_prev[0] !== null && _prev[1] !== null) {
          direction = _s < _prev[1] ? "backward" : "forward";
          const wasPreviouslyInserting = _prev[0] === _prev[1] && _prev[0] < _ml;
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

    // Store the previous selection value
    inputMetadata.prev = [start ?? _s, end ?? _e, _dir ?? "none"];
  });

  useOnDocument("selectionchange", updateSelection);

  const handleInput = $((event: InputEvent) => {
    const input = event.target as HTMLInputElement;
    const newValue = input.value.slice(0, context.numItemsSig.value);

    // Get pattern regex
    const pattern = props.pattern ?? "^\\d*$";
    const regexp = new RegExp(pattern);

    if (newValue.length > 0 && regexp && !regexp.test(newValue)) {
      event.preventDefault();
      input.value = context.inputValueSig.value;
      return;
    }

    const maybeHasDeleted = newValue.length < context.inputValueSig.value.length;
    if (maybeHasDeleted) {
      document.dispatchEvent(new Event("selectionchange"));
    }

    context.inputValueSig.value = newValue;
    context.currIndexSig.value = newValue.length;

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
    if (event.key === "Shift") {
      shiftKeyDown.value = true;
    }
  });

  const handleKeyUp = $((event: KeyboardEvent) => {
    if (event.key === "Shift") {
      shiftKeyDown.value = false;
    }
  });

  const handleFocus = $(() => {
    const input = context.nativeInputRef.value;
    if (input) {
      const start = Math.min(input.value.length, context.numItemsSig.value - 1);
      const end = input.value.length;
      input.setSelectionRange(start, end);
    }
    context.isFocusedSig.value = true;
    updateSelection();
  });

  const handleBlur = $(() => {
    context.isFocusedSig.value = false;
    shiftKeyDown.value = false;
    updateSelection();
  });

  const handlePaste = $((event: ClipboardEvent) => {
    const input = context.nativeInputRef.value;
    const content = event.clipboardData?.getData("text/plain") ?? "";

    if (!input || content === "") return;

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
