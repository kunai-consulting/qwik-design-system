import { type Signal, createContextId } from '@builder.io/qwik';
import type { TriBool } from '../checklist';

export type ArrSigs = Signal<boolean>[];
type CheckContextObj = {
  checklistSig: Signal<TriBool>;
  checkboxes: Signal<ArrSigs>;
  idArr: string[];
};
export const CheckboxContext =
  createContextId<Signal<boolean>>('CheckBox.context');
export const CheckListContext =
  createContextId<CheckContextObj>('CheckList.context');
