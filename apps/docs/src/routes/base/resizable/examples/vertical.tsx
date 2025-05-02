import { component$, useStyles$ } from "@builder.io/qwik";
import { Resizable } from "@kunai-consulting/qwik";
import styles from "./resizable-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <div
      style={{
        width: "100%",
        padding: "20px"
      }}
    >
      <Resizable.Root orientation="vertical" class="resizable-root">
        <Resizable.Content height={100} minHeight={50}>
          <div style={{ padding: "20px", color: "black" }}>Header</div>
        </Resizable.Content>
        <Resizable.Handle class="resizable-handle" />
        <Resizable.Content height={50}>
          <div style={{ padding: "20px", color: "black" }}>Main Content</div>
        </Resizable.Content>
        <Resizable.Handle class="resizable-handle" />
        <Resizable.Content height={150}>
          <div style={{ padding: "20px", color: "black" }}>Footer</div>
        </Resizable.Content>
      </Resizable.Root>
    </div>
  );
});
