import { component$, useContext } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { rootContextId } from "~/routes/layout";



export const Home = component$(() => {
  const { isHome } = useContext(rootContextId);
console.log(isHome.value)
  return (
    <>
    <div class="flex flex-col items-center pt-8 gap-4">
      <img
        src="https://qwik.dev/logos/qwik-logo.svg"
        alt="Qwik Logo"
        width={240}
        height={60}
      />
      <h1 class="text-3xl font-bold text-center max-w-2xl">
        <span class="text-4xl">Qwik</span> - Create and manage accessible, performant, and customizable design systems.
      </h1>
      <Link 
        onClick$={$() => isHome.value = false}
        class="mt-4 px-6 py-3 bg-[#8b5cf6] text-white rounded-lg font-medium hover:bg-[#7c3aed] transition-colors"
      >
        Get started {isHome.value}
      </Link>
    </div>
    </>
  );
});


