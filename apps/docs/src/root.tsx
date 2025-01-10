import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister
} from "@builder.io/qwik-city";
import { isDev } from "@builder.io/qwik/build";
import { RouterHead } from "./docs-widgets/router-head/router-head";

import "./global.css";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link rel="manifest" href={`${import.meta.env.BASE_URL}manifest.json`} />
        )}
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
        <script
          dangerouslySetInnerHTML={`
            window.addEventListener('initPagefind', async () => {
              const pagefind = await import("/pagefind/pagefind.js");
              await pagefind.init();
              window.pagefind = pagefind;
            });
          `}
        />
      </body>
    </QwikCityProvider>
  );
});
