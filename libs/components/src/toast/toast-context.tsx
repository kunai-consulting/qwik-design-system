import { type Signal, createContextId } from "@qwik.dev/core";

export interface ToastContext {
  localId: string;
  isOpenSig: Signal<boolean>;
  titleId: string;
  descriptionId: string;
  duration?: number;
}

export const toastContextId = createContextId<ToastContext>("toast-context");
