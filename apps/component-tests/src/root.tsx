import { component$ } from "@qwik.dev/core";
import {
  QwikRouterProvider,
  RouterOutlet,
  ServiceWorkerRegister
} from "@qwik.dev/router";
import { isDev } from "@qwik.dev/core/build";
import { RouterHead } from "./components/router-head/router-head";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  return (
    <QwikRouterProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link rel="manifest" href={`${import.meta.env.BASE_URL}manifest.json`} />
        )}
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        {!isDev && <ServiceWorkerRegister />}
      </body>
    </QwikRouterProvider>
  );
});
