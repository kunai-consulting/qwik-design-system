import { type Signal, createContextId } from "@builder.io/qwik";

export type ToastContext = {
  /**
   * Unique ID for the toast component
   */
  localId: string;

  /**
   * Signal that tracks if the toast is open
   */
  isOpenSig: Signal<boolean>;

  /**
   * Signal that tracks the total duration for auto-dismissal
   */
  durationSig: Signal<number | null>;
};

export const toastContextId = createContextId<ToastContext>("qds-toast");
