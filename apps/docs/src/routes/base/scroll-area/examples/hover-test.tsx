import { ScrollArea } from "@kunai-consulting/qwik";
// hover-test.tsx
import { component$, useStyles$ } from "@qwik.dev/core";
import styles from "./scroll-area.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <ScrollArea.Root
      type="hover"
      class="scroll-area-root"
      style={{ height: "150px", width: "250px" }}
    >
      <ScrollArea.Viewport class="scroll-area-viewport">
        <div>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos impedit
            rem, repellat deserunt ducimus quasi nisi voluptatem cumque aliquid esse ea
            deleniti eveniet incidunt! Deserunt minus laborum accusamus iusto dolorum.
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis officiis
            error minima eos fugit voluptate excepturi eveniet dolore et, ratione impedit
            consequuntur dolorem hic quae corrupti autem? Dolorem, sit voluptatum.
          </p>
        </div>
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="vertical" class="scroll-area-scrollbar">
        <ScrollArea.Thumb class="scroll-area-thumb" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
});
