import { type Signal, createContextId } from "@builder.io/qwik";

export interface SwitchContext {
  checked: Signal<boolean>;
  disabled: Signal<boolean>;
  required: Signal<boolean>;
  name?: Signal<string | undefined>;
  value?: Signal<string | undefined>;
  onChange$?: (checked: boolean) => void;
  toggle$: () => void;
  triggerId: string;
  labelId: string;
  descriptionId: string;
  errorId: string;
  hasError?: boolean;
}

export const switchContextId = createContextId<SwitchContext>("switch-context");
