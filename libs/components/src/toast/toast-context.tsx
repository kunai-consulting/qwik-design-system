import { type Signal, createContextId } from "@builder.io/qwik";

export interface ToastContext {
  localId: string;
  isOpenSig: Signal<boolean>;
  titleId: string;
  descriptionId: string;
  role: "alert" | "status";
  position: "top" | "top-right" | "top-left" | "bottom" | "bottom-right" | "bottom-left";
  duration?: number;
}

export const toastContextId = createContextId<ToastContext>("toast-context");
