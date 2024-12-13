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

  // Track previous selection state
  const previousSelection = {
    inserting: false,
    start: null as number | null,
    end: null as number | null
  };

  const syncSelection = $(
    (start: number | null, end: number | null, inserting: boolean) => {
      previousSelection.inserting = inserting;
      previousSelection.start = start;
      previousSelection.end = end;

      if (start === null || end === null) {
        context.selectionStartSig.value = null;
        context.selectionEndSig.value = null;
        context.currIndexSig.value = null;
        context.isFocusedSig.value = false;
        return;
      }

      // Update the active slot range
      const indexes = Array.from({ length: end - start }, (_, i) => start + i);
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

    // Handle insertion mode (cursor at end while typing)
    const isInserting = value.length < maxLength && start === value.length;
    if (isInserting) {
      const newEnd = end + 1;
      input.setSelectionRange(start, newEnd);
      syncSelection(start, newEnd, true);
      return;
    }

    // Handle range selection with shift
    if (shiftKeyDown.value && start !== end) {
      input.setSelectionRange(start, end, input.selectionDirection ?? "none");
      syncSelection(start, end, false);
      return;
    }

    // Handle single caret selection
    const isSingleCaret = start === end;
    if (isSingleCaret) {
      let selectionStart = start;
      let selectionEnd = start + 1;
      let direction: "forward" | "backward" | undefined = undefined;

      if (start === 0) {
        selectionStart = 0;
        selectionEnd = 1;
        direction = "forward";
      } else if (start === maxLength) {
        selectionStart = maxLength - 1;
        selectionEnd = maxLength;
        direction = "backward";
      } else {
        let startOffset = 0;
        let endOffset = 1;
        if (previousSelection.start !== null && previousSelection.end !== null) {
          const navigatedBackwards = start < previousSelection.end;
          direction = navigatedBackwards ? "backward" : "forward";
          if (navigatedBackwards && !previousSelection.inserting) {
            startOffset = -1;
          }
          if (shiftKeyDown.value && !previousSelection.inserting) {
            endOffset = 2;
          }
        }
        selectionStart = start + startOffset;
        selectionEnd = start + startOffset + endOffset;
      }

      input.setSelectionRange(selectionStart, selectionEnd, direction);
      syncSelection(selectionStart, selectionEnd, false);
    }
  });

  useOnDocument("selectionchange", updateSelection);

  return (
    <input
      {...props}
      ref={context.nativeInputRef}
      value={context.inputValueSig.value}
      maxLength={context.numItemsSig.value}
      data-qds-otp-hidden-input=""
      inputMode="numeric"
      onInput$={(event) => {
        const input = event.target as HTMLInputElement;
        const newValue = input.value.slice(0, context.numItemsSig.value);

        // Validate input if pattern provided
        if (props.pattern && !new RegExp(props.pattern).test(newValue)) {
          input.value = context.inputValueSig.value;
          return;
        }

        const isBackspace = previousValue.value.length > newValue.length;
        const position = isBackspace
          ? Math.min(context.currIndexSig.value ?? 0, newValue.length)
          : Math.min(newValue.length, context.numItemsSig.value);

        // Update state
        context.inputValueSig.value = newValue;
        previousValue.value = newValue;
        context.currIndexSig.value = position;
        context.selectionStartSig.value = position;
        context.selectionEndSig.value = position;

        // Update cursor
        input.setSelectionRange(position, position);

        if (newValue.length === context.numItemsSig.value) {
          props.onComplete$?.();
        }
      }}
      onKeyDown$={(event) => {
        if (event.key === "Shift") {
          shiftKeyDown.value = true;
        }
      }}
      onKeyUp$={(event) => {
        if (event.key === "Shift") {
          shiftKeyDown.value = false;
        }
      }}
      onFocus$={() => {
        const input = context.nativeInputRef.value;
        if (!input) return;

        context.isFocusedSig.value = true;
        const pos = context.inputValueSig.value.length;
        input.setSelectionRange(pos, pos);
        syncSelection(pos, pos, false);
      }}
      onBlur$={() => {
        shiftKeyDown.value = false;
        context.isFocusedSig.value = false;
        syncSelection(null, null, false);
      }}
    />
  );
});
