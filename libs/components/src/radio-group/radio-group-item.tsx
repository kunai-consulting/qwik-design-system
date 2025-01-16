import {
  component$,
  useContext,
  useSignal,
  useTask$,
  Slot,
  $,
  type PropsOf,
  createContextId,
  useContextProvider,
  Signal,
} from '@builder.io/qwik';
import { radioGroupContextId } from './radio-group-context';

type InternalRadioGroupItemProps = {
  _index?: number;
};

type RadioGroupItemProps = PropsOf<'div'> & { value: string } & InternalRadioGroupItemProps;

type ItemContext = {
  index: number;
  triggerRef: Signal<HTMLButtonElement | undefined>;
}

export const radioGroupItemContextId = createContextId<ItemContext>('qds-radio-group-item');

export const RadioGroupItem = component$<RadioGroupItemProps>(
  ({ value, ...props }) => {
    const context = useContext(radioGroupContextId);
    const itemId = `${context.localId}-$trigger`;
    const itemRef = useSignal<HTMLDivElement | undefined>(undefined);
    const index = props._index;
    const triggerRef = useSignal<HTMLButtonElement | undefined>(undefined);

    if (index === undefined) {
      throw new Error('Qwik Design System: Radio Group Item cannot find its index. Did you wrap this in another component? Make sure it stays with root.');
    }

    const itemContext: ItemContext = {
      index,
      triggerRef,
    }

    useContextProvider(radioGroupItemContextId, itemContext);

    return (
      <div ref={itemRef} id={itemId} data-qds-radio-group-item {...props}>
        <Slot />
      </div>
    );
  }
);
