import { component$, Slot } from '@builder.io/qwik';
import { useChecklist } from './use-checklist';

export const ChecklistRoot = component$(
  (props: { initialStates: boolean[] }) => {
    const { initialStates } = props;
    useChecklist(initialStates);

    return (
      <ul>
        <Slot />
      </ul>
    );
  }
);
