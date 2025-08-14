import { component$, type Signal } from "@builder.io/qwik";

export type ToggleItem = {
  value: string;
  label?: string;
};

export type DocsToggleGroupProps = {
  // Current selected value
  value: Signal<string | undefined>;
  // Items to render in the toggle group
  items: ToggleItem[];
  // Optional accessible label for the group
  ariaLabel?: string;
  // Optional extra classes for the container
  class?: string;
};

export const DocsToggleGroup = component$<DocsToggleGroupProps>((props) => {
  const { value, items, ariaLabel = "Toggle group", class: className } = props;

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      class={[
        "inline-flex overflow-hidden rounded-md border shadow-sm",
        "border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ width: "fit-content" }}
    >
      {items.map((item, idx) => {
        const selected = value.value === item.value;
        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={selected}
            onClick$={() => (value.value = item.value)}
            class={[
              // base
              "px-3 py-1.5 text-sm font-medium transition-colors outline-none",
              // focus ring
              "focus-visible:ring-2 focus-visible:ring-sky-500 ring-offset-2",
              "ring-offset-white dark:ring-offset-neutral-900",
              // borders between items
              idx !== 0
                ? "border-l border-neutral-300 dark:border-neutral-700"
                : "",
              // selected vs idle
              selected
                ? "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
                : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {item.label ?? item.value}
          </button>
        );
      })}
    </div>
  );
});