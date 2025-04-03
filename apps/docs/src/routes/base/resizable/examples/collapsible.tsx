import { component$, useStyles$ } from "@builder.io/qwik";
import { Resizable } from "@kunai-consulting/qwik";
import styles from "./resizable-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <div
      style={{
        width: "100%",
        height: "350px",
        padding: "20px",
        background: "#f5f5f5"
      }}
    >
      <Resizable.Root orientation="horizontal">
        <Resizable.Panel
          width={200}
          minWidth={150}
          collapsible
          collapsedSize={50}
          collapseThreshold={0.05}
        >
          <div style={{ padding: "20px", color: "black" }}>
            Collapsible Panel (min: 150, collapsed: 50)
          </div>
        </Resizable.Panel>

        <Resizable.Handle />

        <Resizable.Panel minWidth={200}>
          <div style={{ padding: "20px", color: "black" }}>
            Regular Panel (min: 200)
          </div>
        </Resizable.Panel>
      </Resizable.Root>
    </div>
  );
});
