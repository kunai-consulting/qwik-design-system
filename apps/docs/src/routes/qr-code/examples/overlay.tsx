import { component$ } from "@builder.io/qwik";
import { QRCode } from "@kunai-consulting/qwik";
import qwikLogo from "./qwik-ui.svg";

export default component$(() => {
  return (
    <QRCode.Root value="https://qwikui.com" size={200} level="H">
      <QRCode.Frame>
        <QRCode.Pattern />
      </QRCode.Frame>
      <QRCode.Overlay>
        <img
          src={qwikLogo}
          alt="Qwik Logo"
          height={75}
          width={75}
        />
      </QRCode.Overlay>
    </QRCode.Root>
  );
});
