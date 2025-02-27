import { type Signal, createContextId } from "@builder.io/qwik";

export type ToastPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

export interface ToastContext {
  rootRef: Signal<HTMLDivElement | undefined>;
  position: ToastPosition;
  isOpen: Signal<boolean>;
  duration: number;
}

export const toastContextId = createContextId<ToastContext>("toast-context");
