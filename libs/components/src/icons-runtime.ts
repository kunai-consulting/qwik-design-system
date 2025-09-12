// Runtime exports for icon namespaces
// These are dummy exports that provide TypeScript with runtime values
// The actual functionality comes from the Vite plugin transformation at build time

import type { Component, PropsOf } from "@qwik.dev/core";
import type * as GeneratedTypes from "../lib-types/virtual-qds-icons";

type IconComponent = Component<PropsOf<"svg">>;

const proxyHandler = {
  // biome-ignore lint/suspicious/noExplicitAny: need any type here
  get(target: any, prop: string | symbol) {
    // This will never be called at runtime - the Vite plugin transforms the JSX
    throw new Error(
      `Icon components should be transformed by the Vite plugin. Tried to access: ${String(prop)}`
    );
  }
};

// Use the generated types from the .d.ts file
export const Academicons: typeof GeneratedTypes.Academicons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const AkarIcons: typeof GeneratedTypes.AkarIcons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const AntDesign: typeof GeneratedTypes.AntDesign = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Arcticons: typeof GeneratedTypes.Arcticons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Basil: typeof GeneratedTypes.Basil = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Bi: typeof GeneratedTypes.Bi = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const BitcoinIcons: typeof GeneratedTypes.BitcoinIcons = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const Bpmn: typeof GeneratedTypes.Bpmn = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Brandico: typeof GeneratedTypes.Brandico = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Bubbles: typeof GeneratedTypes.Bubbles = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Bx: typeof GeneratedTypes.Bx = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Bxl: typeof GeneratedTypes.Bxl = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Bxs: typeof GeneratedTypes.Bxs = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Bytesize: typeof GeneratedTypes.Bytesize = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Carbon: typeof GeneratedTypes.Carbon = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Catppuccin: typeof GeneratedTypes.Catppuccin = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Cbi: typeof GeneratedTypes.Cbi = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Charm: typeof GeneratedTypes.Charm = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Ci: typeof GeneratedTypes.Ci = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Cib: typeof GeneratedTypes.Cib = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Cif: typeof GeneratedTypes.Cif = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Cil: typeof GeneratedTypes.Cil = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const CircleFlags: typeof GeneratedTypes.CircleFlags = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Circum: typeof GeneratedTypes.Circum = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Clarity: typeof GeneratedTypes.Clarity = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Codex: typeof GeneratedTypes.Codex = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Codicon: typeof GeneratedTypes.Codicon = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Covid: typeof GeneratedTypes.Covid = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Cryptocurrency: typeof GeneratedTypes.Cryptocurrency = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const CryptocurrencyColor: typeof GeneratedTypes.CryptocurrencyColor = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const Cuida: typeof GeneratedTypes.Cuida = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Dashicons: typeof GeneratedTypes.Dashicons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Devicon: typeof GeneratedTypes.Devicon = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const DeviconLine: typeof GeneratedTypes.DeviconLine = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const DeviconOriginal: typeof GeneratedTypes.DeviconOriginal = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const DeviconPlain: typeof GeneratedTypes.DeviconPlain = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const DinkieIcons: typeof GeneratedTypes.DinkieIcons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const DuoIcons: typeof GeneratedTypes.DuoIcons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Ei: typeof GeneratedTypes.Ei = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const El: typeof GeneratedTypes.El = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Emojione: typeof GeneratedTypes.Emojione = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const EmojioneMonotone: typeof GeneratedTypes.EmojioneMonotone = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const EmojioneV1: typeof GeneratedTypes.EmojioneV1 = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Entypo: typeof GeneratedTypes.Entypo = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const EntypoSocial: typeof GeneratedTypes.EntypoSocial = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const EosIcons: typeof GeneratedTypes.EosIcons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Ep: typeof GeneratedTypes.Ep = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Et: typeof GeneratedTypes.Et = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Eva: typeof GeneratedTypes.Eva = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const F7: typeof GeneratedTypes.F7 = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Fa: typeof GeneratedTypes.Fa = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Fa6Brands: typeof GeneratedTypes.Fa6Brands = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Fa6Regular: typeof GeneratedTypes.Fa6Regular = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Fa6Solid: typeof GeneratedTypes.Fa6Solid = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Fa7Brands: typeof GeneratedTypes.Fa7Brands = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Fa7Regular: typeof GeneratedTypes.Fa7Regular = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Fa7Solid: typeof GeneratedTypes.Fa7Solid = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const FaBrands: typeof GeneratedTypes.FaBrands = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const FaRegular: typeof GeneratedTypes.FaRegular = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const FaSolid: typeof GeneratedTypes.FaSolid = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Fad: typeof GeneratedTypes.Fad = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Famicons: typeof GeneratedTypes.Famicons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Fe: typeof GeneratedTypes.Fe = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Feather: typeof GeneratedTypes.Feather = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const FileIcons: typeof GeneratedTypes.FileIcons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Flag: typeof GeneratedTypes.Flag = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Flagpack: typeof GeneratedTypes.Flagpack = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const FlatColorIcons: typeof GeneratedTypes.FlatColorIcons = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const FlatUi: typeof GeneratedTypes.FlatUi = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Flowbite: typeof GeneratedTypes.Flowbite = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Fluent: typeof GeneratedTypes.Fluent = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const FluentColor: typeof GeneratedTypes.FluentColor = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const FluentEmoji: typeof GeneratedTypes.FluentEmoji = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const FluentEmojiFlat: typeof GeneratedTypes.FluentEmojiFlat = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const FluentEmojiHighContrast: typeof GeneratedTypes.FluentEmojiHighContrast =
  new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const FluentMdl2: typeof GeneratedTypes.FluentMdl2 = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Fontelico: typeof GeneratedTypes.Fontelico = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Fontisto: typeof GeneratedTypes.Fontisto = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Formkit: typeof GeneratedTypes.Formkit = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Foundation: typeof GeneratedTypes.Foundation = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Fxemoji: typeof GeneratedTypes.Fxemoji = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Gala: typeof GeneratedTypes.Gala = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const GameIcons: typeof GeneratedTypes.GameIcons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Garden: typeof GeneratedTypes.Garden = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Geo: typeof GeneratedTypes.Geo = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Gg: typeof GeneratedTypes.Gg = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Gis: typeof GeneratedTypes.Gis = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const GravityUi: typeof GeneratedTypes.GravityUi = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Gridicons: typeof GeneratedTypes.Gridicons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const GrommetIcons: typeof GeneratedTypes.GrommetIcons = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const Guidance: typeof GeneratedTypes.Guidance = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Healthicons: typeof GeneratedTypes.Healthicons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Heroicons: typeof GeneratedTypes.Heroicons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const HeroiconsOutline: typeof GeneratedTypes.HeroiconsOutline = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const HeroiconsSolid: typeof GeneratedTypes.HeroiconsSolid = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const Hugeicons: typeof GeneratedTypes.Hugeicons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Humbleicons: typeof GeneratedTypes.Humbleicons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Ic: typeof GeneratedTypes.Ic = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const IcomoonFree: typeof GeneratedTypes.IcomoonFree = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const IconPark: typeof GeneratedTypes.IconPark = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const IconParkOutline: typeof GeneratedTypes.IconParkOutline = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const IconParkSolid: typeof GeneratedTypes.IconParkSolid = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const IconParkTwotone: typeof GeneratedTypes.IconParkTwotone = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const Iconamoon: typeof GeneratedTypes.Iconamoon = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Iconoir: typeof GeneratedTypes.Iconoir = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Icons8: typeof GeneratedTypes.Icons8 = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Il: typeof GeneratedTypes.Il = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Ion: typeof GeneratedTypes.Ion = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Iwwa: typeof GeneratedTypes.Iwwa = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Ix: typeof GeneratedTypes.Ix = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Jam: typeof GeneratedTypes.Jam = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const La: typeof GeneratedTypes.La = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const LetsIcons: typeof GeneratedTypes.LetsIcons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const LineMd: typeof GeneratedTypes.LineMd = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Lineicons: typeof GeneratedTypes.Lineicons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Logos: typeof GeneratedTypes.Logos = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Ls: typeof GeneratedTypes.Ls = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Lsicon: typeof GeneratedTypes.Lsicon = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Lucide: typeof GeneratedTypes.Lucide = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const LucideLab: typeof GeneratedTypes.LucideLab = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Mage: typeof GeneratedTypes.Mage = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Majesticons: typeof GeneratedTypes.Majesticons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Maki: typeof GeneratedTypes.Maki = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Map: typeof GeneratedTypes.Map = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Marketeq: typeof GeneratedTypes.Marketeq = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const MaterialIconTheme: typeof GeneratedTypes.MaterialIconTheme = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const MaterialSymbols: typeof GeneratedTypes.MaterialSymbols = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const MaterialSymbolsLight: typeof GeneratedTypes.MaterialSymbolsLight = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const Mdi: typeof GeneratedTypes.Mdi = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const MdiLight: typeof GeneratedTypes.MdiLight = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const MedicalIcon: typeof GeneratedTypes.MedicalIcon = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Memory: typeof GeneratedTypes.Memory = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Meteocons: typeof GeneratedTypes.Meteocons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const MeteorIcons: typeof GeneratedTypes.MeteorIcons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Mi: typeof GeneratedTypes.Mi = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Mingcute: typeof GeneratedTypes.Mingcute = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const MonoIcons: typeof GeneratedTypes.MonoIcons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Mynaui: typeof GeneratedTypes.Mynaui = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Nimbus: typeof GeneratedTypes.Nimbus = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Nonicons: typeof GeneratedTypes.Nonicons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Noto: typeof GeneratedTypes.Noto = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const NotoV1: typeof GeneratedTypes.NotoV1 = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Nrk: typeof GeneratedTypes.Nrk = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Octicon: typeof GeneratedTypes.Octicon = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Oi: typeof GeneratedTypes.Oi = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Ooui: typeof GeneratedTypes.Ooui = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Openmoji: typeof GeneratedTypes.Openmoji = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Oui: typeof GeneratedTypes.Oui = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Pajamas: typeof GeneratedTypes.Pajamas = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Pepicons: typeof GeneratedTypes.Pepicons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const PepiconsPencil: typeof GeneratedTypes.PepiconsPencil = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const PepiconsPop: typeof GeneratedTypes.PepiconsPop = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const PepiconsPrint: typeof GeneratedTypes.PepiconsPrint = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const Ph: typeof GeneratedTypes.Ph = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Picon: typeof GeneratedTypes.Picon = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Pixel: typeof GeneratedTypes.Pixel = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Pixelarticons: typeof GeneratedTypes.Pixelarticons = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const Prime: typeof GeneratedTypes.Prime = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Proicons: typeof GeneratedTypes.Proicons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Ps: typeof GeneratedTypes.Ps = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const QlementineIcons: typeof GeneratedTypes.QlementineIcons = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const Quill: typeof GeneratedTypes.Quill = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const RadixIcons: typeof GeneratedTypes.RadixIcons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Raphael: typeof GeneratedTypes.Raphael = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Ri: typeof GeneratedTypes.Ri = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const RivetIcons: typeof GeneratedTypes.RivetIcons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Si: typeof GeneratedTypes.Si = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const SiGlyph: typeof GeneratedTypes.SiGlyph = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Sidekickicons: typeof GeneratedTypes.Sidekickicons = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const SimpleIcons: typeof GeneratedTypes.SimpleIcons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const SimpleLineIcons: typeof GeneratedTypes.SimpleLineIcons = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const SkillIcons: typeof GeneratedTypes.SkillIcons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Solar: typeof GeneratedTypes.Solar = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Stash: typeof GeneratedTypes.Stash = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Streamline: typeof GeneratedTypes.Streamline = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const StreamlineBlock: typeof GeneratedTypes.StreamlineBlock = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const StreamlineColor: typeof GeneratedTypes.StreamlineColor = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const StreamlineCyber: typeof GeneratedTypes.StreamlineCyber = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const StreamlineCyberColor: typeof GeneratedTypes.StreamlineCyberColor = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const StreamlineEmojis: typeof GeneratedTypes.StreamlineEmojis = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const StreamlineFlex: typeof GeneratedTypes.StreamlineFlex = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const StreamlineFlexColor: typeof GeneratedTypes.StreamlineFlexColor = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const StreamlineFreehand: typeof GeneratedTypes.StreamlineFreehand = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const StreamlineFreehandColor: typeof GeneratedTypes.StreamlineFreehandColor =
  new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const StreamlineGuidance: typeof GeneratedTypes.StreamlineGuidance = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const StreamlineKameleonColor: typeof GeneratedTypes.StreamlineKameleonColor =
  new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const StreamlineLogos: typeof GeneratedTypes.StreamlineLogos = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const StreamlinePixel: typeof GeneratedTypes.StreamlinePixel = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const StreamlinePlump: typeof GeneratedTypes.StreamlinePlump = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const StreamlinePlumpColor: typeof GeneratedTypes.StreamlinePlumpColor = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const StreamlineSharp: typeof GeneratedTypes.StreamlineSharp = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const StreamlineSharpColor: typeof GeneratedTypes.StreamlineSharpColor = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const StreamlineStickiesColor: typeof GeneratedTypes.StreamlineStickiesColor =
  new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const StreamlineUltimate: typeof GeneratedTypes.StreamlineUltimate = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const StreamlineUltimateColor: typeof GeneratedTypes.StreamlineUltimateColor =
  new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Subway: typeof GeneratedTypes.Subway = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const SvgSpinners: typeof GeneratedTypes.SvgSpinners = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const SystemUicons: typeof GeneratedTypes.SystemUicons = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const Tabler: typeof GeneratedTypes.Tabler = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Tdesign: typeof GeneratedTypes.Tdesign = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Teenyicons: typeof GeneratedTypes.Teenyicons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Token: typeof GeneratedTypes.Token = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const TokenBranded: typeof GeneratedTypes.TokenBranded = new Proxy(
  {},
  proxyHandler
);
// Use the generated types from the .d.ts file
export const Topcoat: typeof GeneratedTypes.Topcoat = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Twemoji: typeof GeneratedTypes.Twemoji = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Typcn: typeof GeneratedTypes.Typcn = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Uil: typeof GeneratedTypes.Uil = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Uim: typeof GeneratedTypes.Uim = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Uis: typeof GeneratedTypes.Uis = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Uit: typeof GeneratedTypes.Uit = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Uiw: typeof GeneratedTypes.Uiw = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Unjs: typeof GeneratedTypes.Unjs = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Vaadin: typeof GeneratedTypes.Vaadin = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Vs: typeof GeneratedTypes.Vs = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const VscodeIcons: typeof GeneratedTypes.VscodeIcons = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Websymbol: typeof GeneratedTypes.Websymbol = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Weui: typeof GeneratedTypes.Weui = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Whh: typeof GeneratedTypes.Whh = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Wi: typeof GeneratedTypes.Wi = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Wpf: typeof GeneratedTypes.Wpf = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Zmdi: typeof GeneratedTypes.Zmdi = new Proxy({}, proxyHandler);
// Use the generated types from the .d.ts file
export const Zondicons: typeof GeneratedTypes.Zondicons = new Proxy({}, proxyHandler);
