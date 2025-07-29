import { Resizable } from "@kunai-consulting/qwik";
import { $, component$, useSignal, useStyles$ } from "@qwik.dev/core";
import styles from "./resizable-custom.css?inline";

export default component$(() => {
  const leftPanelSize = useSignal(0);
  const rightPanelSize = useSignal(0);

  useStyles$(styles);
  return (
    <div
      style={{
        width: "100%",
        height: "250px"
      }}
    >
      <Resizable.Root class="resizable-root">
        <Resizable.Content
          width={200}
          minWidth={100}
          maxWidth={500}
          onResize$={$((size: number) => {
            console.log("Left panel size:", `${size}px`);
            leftPanelSize.value = size;
          })}
        >
          <div style={{ padding: "20px", color: "black" }}>
            Left Panel (min: 100, max: 500)
          </div>
        </Resizable.Content>
        <Resizable.Handle class="resizable-handle" />
        <Resizable.Content
          minWidth={150}
          onResize$={$((size: number) => {
            console.log("Right panel size:", `${size}px`);
            rightPanelSize.value = size;
          })}
        >
          <div style={{ padding: "20px", color: "black" }}>Right Panel (min: 150)</div>
        </Resizable.Content>
      </Resizable.Root>
      {leftPanelSize.value > 0 && rightPanelSize.value > 0 && (
        <>
          <p>Left panel size: {Math.floor(leftPanelSize.value)} px</p>
          <p>Right panel size: {Math.floor(rightPanelSize.value)} px</p>
        </>
      )}
    </div>
  );
});
