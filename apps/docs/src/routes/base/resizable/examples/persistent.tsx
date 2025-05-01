import { component$, useStyles$ } from "@builder.io/qwik";
import { Resizable } from "@kunai-consulting/qwik";
import styles from "./resizable-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <div
      style={{
        width: "100%",
        height: "250px"
      }}
    >
      <Resizable.Root storageKey="my-layout" class="resizable-root">
        <Resizable.Content width={200} minWidth={100} maxWidth={500}>
          <div style={{ padding: "20px", color: "black" }}>
            Left Panel (min: 100, max: 500)
          </div>
        </Resizable.Content>
        <Resizable.Handle class="resizable-handle" />
        <Resizable.Content minWidth={150}>
          <div style={{ padding: "20px", color: "black" }}>Right Panel (min: 150)</div>
        </Resizable.Content>
      </Resizable.Root>
    </div>
  );
});
