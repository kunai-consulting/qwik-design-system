import {
  component$,
  useContext,
  useSignal,
  useTask$,
  Slot,
  $,
  type PropsOf,
} from '@builder.io/qwik';
import { radioGroupContextId } from './radio-group-context';

type RadioGroupItemProps = PropsOf<'div'> & { value: string };

export const RadioGroupItem = component$<RadioGroupItemProps>(
  ({ value, ...props }) => {
    const context = useContext(radioGroupContextId);
    const itemId = `${context.localId}-$trigger`;
    const itemRef = useSignal<HTMLDivElement | undefined>(undefined);

    return (
      <div ref={itemRef} id={itemId} data-qds-radio-group-item {...props}>
        <Slot />
      </div>
    );
  }
);
