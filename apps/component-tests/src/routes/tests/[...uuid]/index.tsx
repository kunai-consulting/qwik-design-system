// import { component$ } from "@builder.io/qwik";
// import { routeLoader$, useLocation } from "@builder.io/qwik-city";
// import { getMountedComponent } from "@kunai-consulting/qwik-utils";

// export const useTestData = routeLoader$(async (requestEvent) => {
//   const uuid = requestEvent.params.uuid;
//   const html = getMountedComponent(uuid);
//   return html ? { html, uuid } : null;
// });

// export default component$(() => {
//   const location = useLocation();
//   const testData = useTestData();

//   if (!testData.value) {
//     return <div data-test-error>No test data found for UUID: {location.params.uuid}</div>;
//   }

//   // biome-ignore lint/security/noDangerouslySetInnerHtml: need for route
//   return <div dangerouslySetInnerHTML={testData.value.html} />;
// });
