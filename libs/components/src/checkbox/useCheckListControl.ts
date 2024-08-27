import {
  useContext,
  useContextProvider,
  useSignal,
  useTask$,
  type Signal,
} from '@builder.io/qwik';
import { CheckListContext, CheckboxContext } from './context-id';
import type { TriBool } from '../../utils/tri-bool';

interface UseChecklistControlProps {
  bindChecked?: Signal<boolean>;
  checklist?: boolean;
  _useCheckListContext?: boolean;
  _overWriteCheckbox?: boolean;
}

interface UseChecklistControlReturn {
  checkedSig: Signal<boolean>;
  triStateSig: Signal<TriBool>;
  ariaControlsStrg: string;
}

export function useChecklistControl(
  props: UseChecklistControlProps
): UseChecklistControlReturn {
  const checklistContext = useContext(CheckListContext);
  const defaultSig = useSignal<boolean>(false);
  const checkedSig = props.bindChecked ?? defaultSig;
  const triStateSig = useSignal<TriBool>(checklistContext.checklistSig.value);

  // sync triStateSig and checkedSig
  useTask$(({ track }) => {
    track(() => triStateSig.value);
    if (triStateSig.value !== 'indeterminate') {
      checkedSig.value = triStateSig.value as boolean;
    }
  });

  const ariaControlsStrg = checklistContext.idArr.join(' ');

  return {
    checkedSig,
    triStateSig,
    ariaControlsStrg,
  };
}
