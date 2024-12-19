import { component$, useStyles$ } from "@builder.io/qwik";
import { Checklist } from "@kunai-consulting/qwik-components";
import { LuCheck } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);
  const items = Array.from({ length: 4 }, (_, i) => `Item ${i + 1}`);

  return (
    <Checklist.Root>
      {items.map((item) => (
        <Checklist.Item class="checkbox-root" key={item}>
          <Checklist.ItemTrigger class="checkbox-trigger">
            <Checklist.ItemLabel>{item}</Checklist.ItemLabel>
            <Checklist.ItemIndicator class="checkbox-indicator">
              <LuCheck />
            </Checklist.ItemIndicator>
          </Checklist.ItemTrigger>
        </Checklist.Item>
      ))}
    </Checklist.Root>
  );
});

// internal
import styles from "../../checkbox/examples/checkbox.css?inline";
