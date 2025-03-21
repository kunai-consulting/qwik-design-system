import { component$, useStyles$ } from "@builder.io/qwik";

import spinnerStyles from "./spinner.css?inline";

export const Spinner = component$(() => {
  useStyles$(spinnerStyles);
  return <div class="spinner" />;
});
