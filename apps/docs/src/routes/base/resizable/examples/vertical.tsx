import { component$, useStyles$ } from "@builder.io/qwik";
import { Resizable } from "@kunai-consulting/qwik";
import styles from "./resizable-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <div
      style={{
        width: "100%",
        padding: "20px",
        background: "#f5f5f5"
      }}
    >
      <Resizable.Root orientation="vertical">
        <Resizable.Panel height={100} minHeight={50}>
          <div style={{ padding: "20px", color: "black" }}>Header</div>
        </Resizable.Panel>
        <Resizable.Handle class="resizable-handle" />
        <Resizable.Panel height={50}>
          <div style={{ padding: "20px", color: "black" }}>Main Content</div>
        </Resizable.Panel>
        <Resizable.Handle class="resizable-handle" />
        <Resizable.Panel height={150}>
          <div style={{ padding: "20px", color: "black" }}>Footer</div>
        </Resizable.Panel>
      </Resizable.Root>
    </div>
  );
});
