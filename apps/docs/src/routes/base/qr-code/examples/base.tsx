import { component$, useStyles$ } from "@qwik.dev/core";
import { QRCode } from "@kunai-consulting/qwik";
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
    </QRCode.Root>
  );
});
