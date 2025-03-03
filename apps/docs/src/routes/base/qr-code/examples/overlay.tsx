import { component$, useStyles$ } from "@builder.io/qwik";
import { QRCode } from "@kunai-consulting/qwik";
import qwikLogo from "./qwik-ui.svg";
import styles from "./qr-code.css?inline";

export default component$(() => {
  useStyles$(styles);
  return (
    <QRCode.Root value="https://qwikui.com" level="H">
      <QRCode.Frame class="qr-code-frame">
        <QRCode.PatternSvg width="200" height="200">
          <QRCode.PatternPath fill="black" />
        </QRCode.PatternSvg>
      </QRCode.Frame>
      <QRCode.Overlay>
        <img src={qwikLogo} alt="Qwik Logo" height={75} width={75} />
      </QRCode.Overlay>
    </QRCode.Root>
  );
});
