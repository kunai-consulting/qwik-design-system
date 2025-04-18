import { type Signal, createContextId } from "@builder.io/qwik";

export interface SwitchContext {
  checked: Signal<boolean>;
  disabled: Signal<boolean>;
  required: Signal<boolean>;
  name?: Signal<string>;
  value?: Signal<string>;
  onChange$?: (checked: boolean) => void;
  toggle$: () => void;
  triggerId: string;
  labelId: string;
  descriptionId: string;
  errorId: string;
  isError?: boolean;
}

export const switchContextId = createContextId<SwitchContext>("switch-context");
