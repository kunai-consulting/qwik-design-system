import { component$, useTask$ } from "@qwik.dev/core";
import { Link, useContent, useLocation } from "@qwik.dev/router";

export const Sidebar = component$(() => {
  const { menu } = useContent();
  const loc = useLocation();

  const isContributing = loc.url.pathname.startsWith("/contributing");
  const isBase = !isContributing; // Default to base section if not in contributing

  // Find the core section (always show this)
  const coreSection = menu?.items?.find(
    (section) => section.text === "Qwik core (future)"
  );

  // Filter sections based on current path
  const filteredItems = menu?.items?.filter((section) => {
    if (section.text === "Base" && isBase) return true;
    if (section.text === "Contributing" && isContributing) return true;
    if (section.text === "Qwik core (future)") return true;
    return false;
  });

  return (
    <nav class="flex-col gap-4 sticky top-20 hidden md:flex h-[calc(100vh-160px)]">
      <div class="mb-4">
        <Link
          href={isContributing ? "/base/checkbox" : "/contributing/intro"}
          class="hover:text-qwik-blue-300 hover:underline"
        >
          {isContributing ? "Go to docs" : "Go to contributing"}
        </Link>
      </div>

      {filteredItems?.map((section) => (
        <div key={section.text}>
          <h5 class="mb-2 font-bold text-xl text-white">{section.text}</h5>
          <ul class="flex flex-col">
            {section.items?.map((item) => (
              <li key={item.href} class="hover:bg-neutral-interactive transition-colors">
                <a
                  href={item.href}
                  class={`w-full h-full p-1 px-2 block ${
                    loc.url.pathname === item.href
                      ? "text-qwik-blue-300 bg-neutral-primary"
                      : "text-neutral-foreground"
                  }`}
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
