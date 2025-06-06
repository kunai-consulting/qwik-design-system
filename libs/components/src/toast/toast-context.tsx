import { type Signal, createContextId } from "@builder.io/qwik";

export interface ToastContext {
  localId: string;
  isOpenSig: Signal<boolean>;
  titleId: string;
  descriptionId: string;
  duration?: number;
}

export const toastContextId = createContextId<ToastContext>("toast-context");
