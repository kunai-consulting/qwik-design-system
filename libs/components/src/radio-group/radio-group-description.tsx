import { component$, useContext, Slot, type PropsOf } from '@builder.io/qwik';
import { radioGroupContextId } from './radio-group-context';

type RadioGroupProps = PropsOf<'div'>;

export const RadioGroupDescription = component$<RadioGroupProps>(
  (props: RadioGroupProps) => {
    const context = useContext(radioGroupContextId);

    return (
      <div
        {...props}
        data-qds-radio-group-description
        id={`${context.localId}-description`}
      >
        <Slot />
      </div>
    );
  }
);
