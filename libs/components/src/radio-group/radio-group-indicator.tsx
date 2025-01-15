import {
  component$,
  useContext,
  type PropsOf,
  Slot,
  useStyles$,
} from '@builder.io/qwik';
import { radioGroupContextId } from './radio-group-context';
import './radio-group.css';
import styles from './radio-group.css?inline';

export interface RadioGroupIndicatorProps extends PropsOf<'span'> {
  value: string;
}

export const RadioGroupIndicator = component$<RadioGroupIndicatorProps>(
  (props) => {
    useStyles$(styles);
    const context = useContext(radioGroupContextId);

    return (
      <span
        {...props}
        data-hidden={context.selectedValueSig.value !== props.value}
        data-checked={context.selectedValueSig.value === props.value}
        data-qds-indicator
        aria-hidden={context.selectedValueSig.value !== props.value}
      >
        <Slot />
      </span>
    );
  }
);
