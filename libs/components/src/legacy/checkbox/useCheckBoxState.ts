import type { Signal } from '@builder.io/qwik';
import { useBoundSignal } from '../../../utils/bound-signal';

// supporting multiple frameworks
export function useCheckboxState(externalSignal?: Signal<boolean>) {
  const checked = useBoundSignal(externalSignal, false);
  return { checked };
}

// export function useCheckboxState(externalSignal?: Signal<boolean>) {
//   const checked = useBoundSignal(externalSignal, false);

//   // signals

//   // tasks

//   // events
//   const handleRootClick$ = $(() => {
//     // something with handle root click
//   });

//   return { checked };
// }
