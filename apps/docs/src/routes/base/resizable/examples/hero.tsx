import { component$ } from "@builder.io/qwik";
import { Resizable } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <div
      style={{
        width: "100%",
        height: "250px",
        padding: "20px",
        background: "#f5f5f5"
      }}
    >
      <Resizable.Root>
        <Resizable.Panel width={200} minWidth={100} maxWidth={500}>
          <div style={{ padding: "20px", color: "black" }}>
            Left Panel (min: 100, max: 500)
          </div>
        </Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel minWidth={150}>
          <div style={{ padding: "20px", color: "black" }}>Right Panel (min: 150)</div>
        </Resizable.Panel>
      </Resizable.Root>
    </div>
  );
});
