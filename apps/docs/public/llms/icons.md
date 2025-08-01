# Icons

Accessible via: `/icons`

> TODO: Add description.

<Showcase name="icon-example" />

# Icons

Qwik Icons is a comprehensive icon system that provides access to multiple popular icon libraries in your Qwik applications. The system is inspired and forked from `@qwikest/icons` but has diverged in some ways as well.


## Supported Icon Packs

Our icon system includes the following icon libraries:

- **Bs**: Bootstrap Icons
- **Fa**: Font Awesome 6 Free
- **Fl**: Flowbite Icons
- **Go**: Octicons by GitHub
- **Hi**: Heroicons by Tailwind
- **In**: Iconoir
- **Io**: Ionicons by Ionic
- **Lu**: Lucide (superset of feather icons)
- **Mat**: Material Icons
- **Mo**: Mono Icons
- **Si**: Simple Icons (brand icons)
- **Tb**: Tabler Icons

## Installation

The icons package is included in our design system by default. If you need to install it separately:

```bash
npm i @kunai-consulting/qwik-icons
```

## Usage

Icons can be imported from their respective packages and used directly in your components. They inherit size and color from their parent elements by default.

```tsx
import { LuRocket } from "@kunai-consulting/qwik-icons";

export const MyComponent = component$(() => {
  return (
    <div style={{ color: "red", fontSize: "40px" }}>
      <LuRocket />
    </div>
  );
});
```

## Icon Packs Examples

Here are examples of icons from each supported pack:

```tsx
import { 
  Bs1Circle,
  Fa0Solid,
  FlAdressBookSolid,
  HiAcademicCapMini,
  In1StMedal,
  IoAirplaneOutline,
  LuRocket,
  MatGifBoxSharp,
  MoAdd,
  GoFlame24,
  Si1Password,
  Tb123
} from "@kunai-consulting/qwik-icons";
```

## Styling Icons

Icons inherit their parent's color and size by default. You can customize them using CSS:

```tsx
<div style={{ color: "red", fontSize: "24px" }}>
  <LuRocket />
</div>
```

> In the example above, the icon will be red and 24px in size.

## Differences from Qwikest Icons

- Each component is a regular Qwik component (it uses `component$`).
- Every icons can be grabbed from `@kunai-consulting/qwik-icons`, rather than having to grab from the `/lucide` or `/feather` subpaths.
- Icons are part of the Icon namespace, and autocomplete to the specific icon you're searching for.

## Roadmap

- The ability to place child markup inside the svg (e.g `<title>` or `<desc>`)
- An action that updates the latest new icons over time
- New icon packs (requested so far: `css.gg`, `phosphor`, `remixicon`)





