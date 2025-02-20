import { component$ } from "@qwik.dev/core";
import { Link, useContent, useLocation } from "@qwik.dev/router";

export const Sidebar = component$(() => {
  const { menu } = useContent();
  const loc = useLocation();

  return (
    <nav class="flex-col gap-4 sticky top-20 h-full hidden md:flex">
      {menu?.items?.map((section) => (
        <div key={section.text}>
          <h5 class="mb-2 font-bold text-xl text-qwik-neutral-300">{section.text}</h5>
          <ul class="flex flex-col">
            {section.items?.map((item) => (
              <li key={item.href} class="hover:bg-qwik-neutral-800 rounded-sm">
                <a
                  href={item.href}
                  class={`w-full h-full p-1 px-2 block ${loc.url.pathname === item.href ? "text-qwik-blue-400" : ""}`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
});
