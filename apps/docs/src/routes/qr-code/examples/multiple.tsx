import { component$ } from "@builder.io/qwik";
import { QRCode } from "@kunai-consulting/qwik";
import qwikLogo from "~/routes/qr-code/examples/qwik-ui.svg";

export default component$(() => {
  return (
    <div>
      <QRCode.Root value="https://qwikui.com" size={200} level="L" margin={4}>
        <QRCode.Canvas />
      </QRCode.Root>

      <QRCode.Root value="https://qwikui.com" size={200} level="H" margin={4}>
        <QRCode.Canvas />
        <QRCode.Overlay image={qwikLogo} size={35} />
      </QRCode.Root>
    </div>
  );
});
