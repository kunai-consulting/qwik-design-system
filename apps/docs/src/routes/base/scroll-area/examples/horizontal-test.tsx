import { ScrollArea } from "@kunai-consulting/qwik";
import { component$, useStyles$ } from "@qwik.dev/core";
import styles from "./scroll-area.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <ScrollArea.Root class="scroll-area-root" style={{ height: "200px", width: "100px" }}>
      <ScrollArea.Viewport class="scroll-area-viewport">
        <div>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos impedit
            rem, repellat deserunt ducimus quasi nisi voluptatem cumque aliquid esse ea
            deleniti eveniet incidunt! Deserunt minus laborum accusamus iusto dolorum.
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Blanditiisofficiiserror minima eos fugit voluptate excepturi eveniet dolore
            et, ratione impedit consequuntur dolorem hic quae corrupti autem? Dolorem, sit
            voluptatum.
          </p>
        </div>
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar orientation="horizontal" class="scroll-area-scrollbar">
        <ScrollArea.Thumb class="scroll-area-thumb" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
});
