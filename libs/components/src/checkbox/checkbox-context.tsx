import { createContextId, type Signal } from '@builder.io/qwik';

export const checkboxContextId =
  createContextId<CheckboxContext>('qds-checkbox-context');

export type CheckboxContext = {
  isCheckedSig: Signal<boolean>;
}
