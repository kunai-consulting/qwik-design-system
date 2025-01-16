import { component$, useStyles$ } from "@builder.io/qwik";
import { QRCode } from "@kunai-consulting/qwik";
// import styles from "./qr-code.css?inline";
import qwikLogo from './qwik-ui.svg';

export default component$(() => {
  // useStyles$(styles);
  return (
    <QRCode.Root
      value="https://qwikui.com"
      size={200}
      level="H"
      margin={4}
    >
      <QRCode.Canvas />
      <QRCode.Overlay
        image={qwikLogo}
        size={35}
      />
    </QRCode.Root>
  );
});
