import { QRCode } from "@kunai-consulting/qwik";
import { component$, useStyles$ } from "@qwik.dev/core";
import styles from "./qr-code.css?inline";
import qwikLogo from "./qwik-ui.svg";

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
