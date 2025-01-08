import { component$, useContext, Slot, type PropsOf } from '@builder.io/qwik';
import { radioGroupContextId } from './radio-group-context';

type RadioGroupItemProps = PropsOf<'div'> & { value: string };

export const RadioGroupItem = component$<RadioGroupItemProps>(
  ({ value, ...props }) => {
    const context = useContext(radioGroupContextId);
    const itemId = `${context.localId}-${value}`;

    return (
      <div id={itemId} {...props} data-qds-radio-group-item>
        <Slot />
      </div>
    );
  }
);
