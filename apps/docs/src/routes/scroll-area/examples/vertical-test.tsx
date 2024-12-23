import { component$, useStyles$ } from "@builder.io/qwik";
import { ScrollArea } from "@kunai-consulting/qwik-components";
import styles from "./scroll-area.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <ScrollArea.Root class="scroll-area-root" style={{ height: "150px", width: "250px" }}>
      <ScrollArea.ViewPort class="scroll-area-viewport">
        {/* Content with fixed height to ensure scrolling */}
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
      </ScrollArea.ViewPort>

      <ScrollArea.Scrollbar orientation="vertical" class="scroll-area-scrollbar">
        <ScrollArea.Thumb class="scroll-area-thumb" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
});
