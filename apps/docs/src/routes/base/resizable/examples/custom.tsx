import { Resizable } from "@kunai-consulting/qwik";
import { component$, useStyles$ } from "@qwik.dev/core";
import styles from "./resizable-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <div
      style={{
        width: "100%",
        height: "350px"
      }}
    >
      <Resizable.Root orientation="horizontal" class="resizable-root">
        <Resizable.Content width={200}>
          <div style={{ padding: "20px", color: "black" }}>Left Content</div>
        </Resizable.Content>

        <Resizable.Handle class="resizable-handle" />

        <Resizable.Content>
          <Resizable.Root orientation="vertical">
            <Resizable.Content height={200}>
              <div style={{ padding: "20px", color: "black" }}>Top Content</div>
            </Resizable.Content>

            <Resizable.Handle class="resizable-handle" />

            <Resizable.Content>
              <div style={{ padding: "20px", color: "black" }}>Bottom Content</div>
            </Resizable.Content>
          </Resizable.Root>
        </Resizable.Content>
      </Resizable.Root>
    </div>
  );
});
