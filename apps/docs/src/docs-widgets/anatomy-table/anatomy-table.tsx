import { component$ } from "@builder.io/qwik";
import { api } from "~/routes/checkbox/auto-api/api";
import { MainHeading } from "../toc/toc";

export const AnatomyTable = component$(() => {
  return (
    <div class="my-4">
      <MainHeading>Anatomy</MainHeading>
      <table class="w-full">
        <thead>
          <tr>
            <th class="text-left p-2 border-b">Part</th>
            <th class="text-left p-2 border-b">Description</th>
          </tr>
        </thead>
        <tbody>
          {api.anatomy.map((item) => (
            <tr key={item.name}>
              <td class="p-2 border-b font-mono">{item.name}</td>
              <td class="p-2 border-b">{item.description || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
