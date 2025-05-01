import { $, component$, useStyles$ } from "@builder.io/qwik";
import { Resizable } from "@kunai-consulting/qwik";
import styles from "./resizable-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <div style={{ width: "100%", height: "350px" }}>
      <Resizable.Root orientation="horizontal" class="resizable-root">
        <Resizable.Content
          width={200}
          minWidth={150}
          collapsible
          collapsedSize={50}
          collapseThreshold={0.05}
          onCollapse$={$(() => {
            console.log("Panel collapsed");
          })}
          onExpand$={$(() => {
            console.log("Panel expanded");
          })}
        >
          <div style={{ padding: "20px", color: "black" }}>
            Collapsible Panel (min: 150, collapsed: 50)
          </div>
        </Resizable.Content>

        <Resizable.Handle class="resizable-handle" />

        <Resizable.Content minWidth={200}>
          <div style={{ padding: "20px", color: "black" }}>Regular Panel (min: 200)</div>
        </Resizable.Content>
      </Resizable.Root>
    </div>
  );
});
