import { component$, useContextProvider, useSignal } from '@builder.io/qwik';
import { Checkbox } from '@kunai-consulting/qwik-components';

export const CheckboxList = component$(() => {
  // Initialize an array of signals for each checkbox's checked state
  const checkboxes = Array.from({ length: 5 }, () => useSignal(false));

  // Provide the CheckListContext with the array of checkbox signals
  // useContextProvider(CheckListContext, {
  //   checkboxes: checkboxes,
  //   checklistSig: useSignal('indeterminate'), // Initial state
  // });

  return (
    <div>
      {checkboxes.map((checkboxSignal, index) => (
        <Checkbox.Root
          key={`checkbox-${index}${new Date().getTime()}`}
          bind:checked={checkboxSignal}
          _useCheckListContext={true}
        >
          Checkbox {index + 1}
        </Checkbox.Root>
      ))}
    </div>
  );
});
