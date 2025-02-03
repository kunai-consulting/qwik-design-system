import { component$ } from "@builder.io/qwik";
import { QRCode } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <QRCode.Root value="https://qwikui.com" size={200} level="L" margin={4}>
      <QRCode.Frame>
        <QRCode.Pattern />
      </QRCode.Frame>
    </QRCode.Root>
  );
});
