import { component$, useTask$ } from "@builder.io/qwik";
import { Link, useContent, useLocation } from "@builder.io/qwik-city";

export const Sidebar = component$(() => {
  const { menu } = useContent();
  const loc = useLocation();

  return (
    <nav class="flex-col gap-4 sticky top-20 hidden md:flex h-[calc(100vh-160px)]">
      {menu?.items?.map((section) => (
        <div key={section.text}>
          <h5 class="mb-2 font-bold text-xl text-white">{section.text}</h5>
          <ul class="flex flex-col">
            {section.items?.map((item) => (
              <li key={item.href} class="hover:bg-neutral-interactive transition-colors">
                <Link
                  href={item.href}
                  class={`w-full h-full p-1 px-2 block ${
                    loc.url.pathname === item.href
                      ? "text-qwik-blue-300 bg-neutral-primary"
                      : "text-neutral-foreground"
                  }`}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
});
