import { component$, useStyles$ } from "@builder.io/qwik";
import { Checklist } from "@kunai-consulting/qwik-components";
import { LuCheck, LuMinus } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);
  const items = Array.from({ length: 4 }, (_, i) => `Item ${i + 1}`);

  return (
    <Checklist.Root>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Checklist.SelectAll class="checkbox-trigger select-all-trigger">
          <Checklist.SelectAllIndicator class="checkbox-indicator">
            <LuCheck data-check-icon />
            <LuMinus data-minus-icon />
          </Checklist.SelectAllIndicator>
        </Checklist.SelectAll>
        <Checklist.Label>All items</Checklist.Label>
      </div>
      <div style={{ marginLeft: "32px" }}>
        {items.map((item) => (
          <Checklist.Item
            style={{ marginBottom: "8px", marginTop: "8px" }}
            class="checkbox-root"
            key={item}
          >
            <Checklist.ItemTrigger class="checkbox-trigger">
              <Checklist.ItemIndicator class="checkbox-indicator">
                <LuCheck />
              </Checklist.ItemIndicator>
            </Checklist.ItemTrigger>
            <Checklist.ItemLabel>{item}</Checklist.ItemLabel>
          </Checklist.Item>
        ))}
      </div>
    </Checklist.Root>
  );
});

// internal
import styles from "../../checkbox/examples/checkbox.css?inline";
