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
        return;
      }

      context.selectionStartSig.value = start;
      context.selectionEndSig.value = end;
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
      let newStart = start;
      let newEnd = start + 1;
      let direction: "forward" | "backward" = "forward";

      // At start of input
      if (start === 0) {
        newStart = 0;
        newEnd = 1;
        direction = "forward";
      }
      // At end of input
      else if (start >= maxLength) {
        newStart = maxLength - 1;
        newEnd = maxLength;
        direction = "backward";
      }
      // Handle backward navigation
      else if (previousSelection.end !== null && start < previousSelection.end) {
        newStart = start - 1;
        newEnd = start;
        direction = "backward";
      }

      input.setSelectionRange(newStart, newEnd, direction);
      syncSelection(newStart, newEnd, false);
    }
  });

  useOnDocument("selectionchange", updateSelection);

  return (
    <input
      {...props}
      ref={context.nativeInputRef}
      value={context.inputValueSig.value}
      maxLength={context.numItemsSig.value}
      onInput$={(event) => {
        const input = event.target as HTMLInputElement;
        const newValue = input.value.slice(0, context.numItemsSig.value);
        const pattern =
          props.pattern !== null ? new RegExp(props.pattern ?? "^\\d*$") : null;

        if (pattern && !pattern.test(newValue)) {
          input.value = context.inputValueSig.value;
          return;
        }

        context.inputValueSig.value = newValue;
        updateSelection();

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

        input.setSelectionRange(
          context.inputValueSig.value.length,
          context.inputValueSig.value.length
        );
        updateSelection();
      }}
      onBlur$={() => {
        shiftKeyDown.value = false;
        syncSelection(null, null, false);
      }}
    />
  );
});
