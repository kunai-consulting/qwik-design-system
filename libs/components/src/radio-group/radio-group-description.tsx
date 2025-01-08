import {
  component$,
  type PropsOf,
  Slot,
  sync$,
  useContext,
  useOnWindow,
  useTask$,
} from '@builder.io/qwik';
import { radioGroupContextId } from './radio-group-context';

type RadioGroupDescriptionProps = PropsOf<'div'>;

export const RadioGroupDescription = component$(
  (props: RadioGroupDescriptionProps) => {
    const context = useContext(radioGroupContextId);
    const descriptionId = `${context.localId}-description`;

    useTask$(() => {
      if (!context.isDescription) {
        console.warn(
          'Qwik Design System Warning: No description prop provided to the Radio Group Root component.'
        );
      }
    });

    return (
      <div id={descriptionId} data-qds-checkbox-description {...props}>
        <Slot />
      </div>
    );
  }
);
