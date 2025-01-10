import { component$, useStyles$, useSignal } from '@builder.io/qwik';
import { RadioGroup } from '@kunai-consulting/qwik';
import { LuCircle } from '@qwikest/icons/lucide';

export default component$(() => {
  useStyles$(styles);
  const items = Array.from({ length: 4 }, (_, i) => `Item ${i + 1}`);

  return (
    <RadioGroup.Root class="radio-group" name="hero">
      <RadioGroup.Label class="radio-group__label">Items</RadioGroup.Label>
      {items.map((item, index) => (
        <RadioGroup.Item
          class="checkbox-root"
          key={item}
          value={item}
          index={index}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RadioGroup.Label>{item}</RadioGroup.Label>
            <RadioGroup.Trigger
              class="radio-group-trigger"
              _index={index}
              value={item}
              name="hero"
            >
              <RadioGroup.Indicator class="radio-group-indicator" value={item}>
                <LuCircle />
              </RadioGroup.Indicator>
            </RadioGroup.Trigger>
          </div>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
});

//  styles
import styles from './radio-group.css?inline';
