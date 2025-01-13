import {
  component$,
  useContext,
  Slot,
  $,
  type PropsOf,
} from '@builder.io/qwik';
import { radioGroupContextId } from './radio-group-context';

type RadioGroupItemProps = PropsOf<'div'> & { value: string; index: number };

export const RadioGroupItem = component$<RadioGroupItemProps>(
  ({ value, index, ...props }) => {
    const context = useContext(radioGroupContextId);
    const itemId = `${context.localId}-$trigger`;

    return (
      <div id={itemId} data-qds-radio-group-item {...props}>
        <Slot />
      </div>
    );
  }
);
