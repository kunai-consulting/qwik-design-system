import {
  component$,
  useContext,
  Slot,
  type PropsOf,
  useStyles$,
} from '@builder.io/qwik';
import { radioGroupContextId } from './radio-group-context';

type RadioGroupProps = PropsOf<'div'>;

export const RadioGroupItemIndicator = component$<RadioGroupProps>((props) => {
  const context = useContext(radioGroupContextId);

  return (
    <div
      {...props}
      data-hidden={!context.selectedValueSig.value}
      data-checked={context.selectedValueSig.value ? '' : undefined}
      data-qds-indicator
      aria-hidden="true"
    >
      <Slot />
    </div>
  );
});
