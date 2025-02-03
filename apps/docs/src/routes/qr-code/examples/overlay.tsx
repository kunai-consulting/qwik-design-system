import { component$ } from "@builder.io/qwik";
import { QRCode } from "@kunai-consulting/qwik";
import qwikLogo from "./qwik-ui.svg";

export default component$(() => {
  return (
    <QRCode.Root
      value="https://qwikui.com"
      size={200}
      level="H"
      margin={4}
      aria-label="Scan this QR code to visit our website"
    >
      <QRCode.Overlay
        image={qwikLogo}
        size={35}
      />
      <QRCode.Canvas />
    </QRCode.Root>
  );
});
