import {
  $,
  type PropsOf,
  component$,
  sync$,
  useComputed$,
  useContext,
  useOnDocument,
  useSignal
} from "@qwik.dev/core";
import { OTPContextId } from "./otp-context";
type PublicOtpNativeInputProps = PropsOf<"input"> & {
  pattern?: string | null;
};
/** Hidden input component that handles OTP input interactions and validation */
export const OtpHiddenInput = component$((props: PublicOtpNativeInputProps) => {
  const context = useContext(OTPContextId);
  const previousValue = useSignal<string>("");
  const shiftKeyDown = useSignal(false);
  const hasBeenFocused = useSignal(false);

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
        context.selectionStart.value = null;
        context.selectionEnd.value = null;
        context.currentIndex.value = null;
        context.isFocused.value = false;
        return;
      }

      context.selectionStart.value = start;
      context.selectionEnd.value = Math.min(end, context.numItems);
      context.currentIndex.value = start;
    }
  );

  const updateSelection = $(() => {
    const input = context.nativeInputRef.value;
    if (!input || document.activeElement !== input) {
      syncSelection(null, null, false);
      return;
    }

    const maxLength = context.numItems;
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

  /**
   *  Prevent the left arrow key from skipping over filled slots when traveling from empty slots
   */
  const handleKeyDownSync$ = sync$((e: KeyboardEvent) => {
    const input = e.target as HTMLInputElement;

    if (e.key === "ArrowLeft" && input.selectionStart === input.selectionEnd) {
      const currentPos = input.selectionStart;
      if (!currentPos) return;

      const value = input.value;
      if (!value[currentPos] && value[currentPos - 1]) {
        e.preventDefault();
      }
    }
  });

  const handleKeyDown = $((e: KeyboardEvent) => {
    if (e.key === "Shift") {
      shiftKeyDown.value = true;
      return;
    }

    const input = e.target as HTMLInputElement;
    if (e.key === "ArrowLeft" && input.selectionStart === input.selectionEnd) {
      const currentPos = input.selectionStart;
      if (!currentPos) return;

      const value = input.value;
      if (!value[currentPos] && value[currentPos - 1]) {
        let newPos = currentPos - 1;
        while (newPos > 0 && !value[newPos - 1]) {
          newPos--;
        }
        input.setSelectionRange(newPos, newPos + 1);
        syncSelection(newPos, newPos + 1, false);
      }
    }
  });

  const isFirstKeystroke = useSignal(true);

  const handleKeyPressSync$ = sync$((e: KeyboardEvent, input: HTMLInputElement) => {
    if (e.key.length > 1) return;

    if (!new RegExp(input.pattern).test(e.key)) {
      e.preventDefault();
      return;
    }
  });

  const handleInput = $((e: InputEvent) => {
    const input = e.target as HTMLInputElement;
    const newValue = input.value.slice(0, context.numItems);

    // No longer first keystroke
    isFirstKeystroke.value = false;

    const isBackspace = previousValue.value.length > newValue.length;
    const position = input.selectionStart ?? 0;

    context.code.value = newValue;
    previousValue.value = newValue;

    // backspacing and not at last filled position, move back
    if (isBackspace && position > 0 && position !== previousValue.value.length) {
      const newPos = position - 1;
      context.currentIndex.value = newPos;
      context.selectionStart.value = newPos;
      context.selectionEnd.value = newPos + 1;
      input.setSelectionRange(newPos, newPos + 1);
      // after backspace
      previousSelection.value = {
        inserting: false,
        start: newPos,
        end: newPos + 1
      };
    } else {
      context.currentIndex.value = position;
      context.selectionStart.value = position;
      context.selectionEnd.value = position + 1;
      input.setSelectionRange(position, position + 1);
      // normal input
      previousSelection.value = {
        inserting: false,
        start: position,
        end: position + 1
      };
    }
  });

  const handleKeyUp = $((e: KeyboardEvent) => {
    if (e.key === "Shift") {
      shiftKeyDown.value = false;
    }
  });

  const handleFocus = $(() => {
    hasBeenFocused.value = true;
    // Reset first keystroke flag on focus
    isFirstKeystroke.value = true;
    const input = context.nativeInputRef.value;
    if (!input) return;

    context.isFocused.value = true;
    const pos = context.code.value.length;

    input.setSelectionRange(pos, pos);
    syncSelection(pos, pos, false);
  });

  const handleBlur = $(() => {
    shiftKeyDown.value = false;
    context.isFocused.value = false;
    syncSelection(null, null, false);
  });

  const maxLength = useComputed$(() => {
    if (hasBeenFocused.value) {
      return context.numItems;
    }
    return context.code.value.length;
  });

  return (
    <input
      {...props}
      ref={context.nativeInputRef}
      value={context.code.value}
      disabled={context.isDisabled.value ?? false}
      maxLength={maxLength.value}
      // The identifier for the hidden input element that handles OTP input
      data-qds-otp-hidden-input
      // Indicates whether password manager suggestions should be shifted
      data-shift={context.shiftPWManagers ? "" : undefined}
      inputMode="numeric"
      onInput$={[handleInput, props.onInput$]}
      onKeyDown$={[handleKeyDownSync$, handleKeyDown, props.onKeyDown$]}
      pattern={props.pattern ?? "^[0-9]*$"}
      onKeyPress$={[handleKeyPressSync$, props.onKeyPress$]}
      onKeyUp$={[handleKeyUp, props.onKeyUp$]}
      onFocus$={[handleFocus, props.onFocus$]}
      onBlur$={[handleBlur, props.onBlur$]}
    />
  );
});
