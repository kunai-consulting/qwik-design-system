import { component$, useStyles$ } from "@builder.io/qwik";
import { ScrollArea } from "@kunai-consulting/qwik-components";
import styles from './scroll-area.css?inline';

export default component$(() => {
  useStyles$(styles);
  return (
    <ScrollArea.Root class="scroll-area-root" style={{ height: "200px", width: "150px" }}>
      <ScrollArea.ViewPort class="scroll-area-viewport">
        <div class="p-4">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos
            impedit rem, repellat deserunt ducimus quasi nisi voluptatem cumque
            aliquid esse ea deleniti eveniet incidunt! Deserunt minus laborum
            accusamus iusto dolorum. Lorem ipsum dolor sit, amet consectetur
            adipisicing elit. Blanditiisofficiiserrorminimaeos fugit voluptate
            excepturi eveniet dolore et, ratione impedit consequuntur dolorem hic
            quae corrupti autem? Dolorem, sit voluptatum.
          </p>
        </div>
      </ScrollArea.ViewPort>

      <ScrollArea.Scrollbar orientation="vertical" class="scroll-area-scrollbar">
        <ScrollArea.Thumb class="scroll-area-thumb"/>
      </ScrollArea.Scrollbar>

      <ScrollArea.Scrollbar orientation="horizontal" class="scroll-area-scrollbar">
        <ScrollArea.Thumb class="scroll-area-thumb"/>
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
});

