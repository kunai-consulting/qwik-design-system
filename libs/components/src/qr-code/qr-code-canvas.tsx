import { component$, useContext, $, type PropsOf, useSignal } from "@builder.io/qwik";
import { qrCodeContextId } from "./qr-code-context";
import { encode } from 'uqr';

type CanvasProps = PropsOf<"div"> & {
  class?: string;
};

export const QRCodeCanvas = component$<CanvasProps>((props) => {
  const context = useContext(qrCodeContextId);
  const containerRef = useSignal<HTMLDivElement>();

  const renderQR$ = $(async () => {
    const container = containerRef.value;
    if (!container) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = context.size.value;
      canvas.height = context.size.value;

      const qrResult = encode(context.value.value, {
        ecc: context.level.value,
        border: context.margin.value
      });

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate module size and offset for centering
      const moduleSize = Math.floor((context.size.value - 2 * context.margin.value) / qrResult.size);
      const offset = Math.floor((context.size.value - moduleSize * qrResult.size) / 2);

      // Draw QR code
      ctx.fillStyle = '#000000';

      qrResult.data.forEach((row, y) => {
        row.forEach((isBlack, x) => {
          if (isBlack) {
            ctx.fillRect(
              offset + x * moduleSize,
              offset + y * moduleSize,
              moduleSize,
              moduleSize
            );
          }
        });
      });

      // Process overlay if exists
      if (context.overlay.value) {
        const img = new Image();

        img.onload = () => {
          const overlaySize = context.overlay.value?.size || Math.floor(context.size.value * 0.3);
          const overlayX = (context.size.value - overlaySize) / 2;
          const overlayY = (context.size.value - overlaySize) / 2;

          // Draw white background for overlay
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(overlayX, overlayY, overlaySize, overlaySize);

          // Draw overlay image
          ctx.drawImage(img, overlayX, overlayY, overlaySize, overlaySize);

          // Update container after overlay is drawn
          container.innerHTML = '';
          container.appendChild(canvas);
        };

        img.onerror = (error) => {
          console.error('Error loading overlay image:', error);
          // If overlay fails, still show the QR code
          container.innerHTML = '';
          container.appendChild(canvas);
        };

        img.src = context.overlay.value.image;
      } else {
        // No overlay, just show the QR code
        container.innerHTML = '';
        container.appendChild(canvas);
      }
    } catch (error) {
      console.error('Error rendering QR:', error);
    }
  });

  return (
    <div
      ref={containerRef}
      class={props.class}
      onClick$={renderQR$}
      data-qr-container
    >
      <script dangerouslySetInnerHTML={`
        (function() {
          let attempts = 0;
          const maxAttempts = 50;
          const interval = setInterval(() => {
            const container = document.querySelector('[data-qr-container]');
            if (container) {
              clearInterval(interval);
              const event = new Event('click');
              container.dispatchEvent(event);
            }
            attempts++;
            if (attempts >= maxAttempts) {
              clearInterval(interval);
            }
          }, 100);
        })();
      `} />
    </div>
  );
});
