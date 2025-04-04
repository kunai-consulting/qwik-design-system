// hover-no-overflow-test.tsx
import { component$, useStyles$ } from "@builder.io/qwik";
import { ScrollArea } from "@kunai-consulting/qwik";
import styles from "./scroll-area.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <ScrollArea.Root
      type="hover"
      class="scroll-area-root"
      style={{ height: "200px", width: "250px" }}
    >
      <ScrollArea.Viewport class="scroll-area-viewport">
        <div>
          <p>Short content that doesn't overflow.</p>
        </div>
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical" class="scroll-area-scrollbar">
        <ScrollArea.Thumb class="scroll-area-thumb" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
});
