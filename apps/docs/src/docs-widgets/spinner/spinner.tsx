import { component$, useStyles$ } from "@qwik.dev/core";

import spinnerStyles from "./spinner.css?inline";

export const Spinner = component$(() => {
  useStyles$(spinnerStyles);
  return <div class="spinner" />;
});
