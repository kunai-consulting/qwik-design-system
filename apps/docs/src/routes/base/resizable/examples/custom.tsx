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
        <Resizable.Panel width={200}>
          <div style={{ padding: "20px", color: "black" }}>Left Panel</div>
        </Resizable.Panel>

        <Resizable.Handle />

        <Resizable.Panel>
          <Resizable.Root orientation="vertical">
            <Resizable.Panel height={200}>
              <div style={{ padding: "20px", color: "black" }}>Top Panel</div>
            </Resizable.Panel>

            <Resizable.Handle />

            <Resizable.Panel>
              <div style={{ padding: "20px", color: "black" }}>Bottom Panel</div>
            </Resizable.Panel>
          </Resizable.Root>
        </Resizable.Panel>
      </Resizable.Root>
    </div>
  );
});
