// Runtime exports for icon namespaces
// These are dummy exports that provide TypeScript with runtime values
// The actual functionality comes from the Vite plugin transformation at build time

import type { Component, PropsOf } from "@qwik.dev/core";
import type * as GeneratedTypes from "../lib-types/virtual-qds-icons";

type IconComponent = Component<PropsOf<"svg">>;

const proxyHandler = {
  get(target: any, prop: string | symbol) {
    // This will never be called at runtime - the Vite plugin transforms the JSX
    throw new Error(`Icon components should be transformed by the Vite plugin. Tried to access: ${String(prop)}`);
  }
};

// Use the generated types from the .d.ts file
export const Academicons: typeof GeneratedTypes.Academicons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const AkarIcons: typeof GeneratedTypes.AkarIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const AntDesign: typeof GeneratedTypes.AntDesign = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Arcticons: typeof GeneratedTypes.Arcticons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Basil: typeof GeneratedTypes.Basil = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Bi: typeof GeneratedTypes.Bi = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const BitcoinIcons: typeof GeneratedTypes.BitcoinIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Bpmn: typeof GeneratedTypes.Bpmn = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Brandico: typeof GeneratedTypes.Brandico = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Bubbles: typeof GeneratedTypes.Bubbles = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Bx: typeof GeneratedTypes.Bx = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Bxl: typeof GeneratedTypes.Bxl = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Bxs: typeof GeneratedTypes.Bxs = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Bytesize: typeof GeneratedTypes.Bytesize = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Carbon: typeof GeneratedTypes.Carbon = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Catppuccin: typeof GeneratedTypes.Catppuccin = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Cbi: typeof GeneratedTypes.Cbi = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Charm: typeof GeneratedTypes.Charm = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Ci: typeof GeneratedTypes.Ci = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Cib: typeof GeneratedTypes.Cib = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Cif: typeof GeneratedTypes.Cif = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Cil: typeof GeneratedTypes.Cil = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const CircleFlags: typeof GeneratedTypes.CircleFlags = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Circum: typeof GeneratedTypes.Circum = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Clarity: typeof GeneratedTypes.Clarity = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Codex: typeof GeneratedTypes.Codex = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Codicon: typeof GeneratedTypes.Codicon = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Covid: typeof GeneratedTypes.Covid = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Cryptocurrency: typeof GeneratedTypes.Cryptocurrency = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const CryptocurrencyColor: typeof GeneratedTypes.CryptocurrencyColor = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Cuida: typeof GeneratedTypes.Cuida = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Dashicons: typeof GeneratedTypes.Dashicons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Devicon: typeof GeneratedTypes.Devicon = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const DeviconLine: typeof GeneratedTypes.DeviconLine = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const DeviconOriginal: typeof GeneratedTypes.DeviconOriginal = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const DeviconPlain: typeof GeneratedTypes.DeviconPlain = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const DinkieIcons: typeof GeneratedTypes.DinkieIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const DuoIcons: typeof GeneratedTypes.DuoIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Ei: typeof GeneratedTypes.Ei = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const El: typeof GeneratedTypes.El = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Emojione: typeof GeneratedTypes.Emojione = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const EmojioneMonotone: typeof GeneratedTypes.EmojioneMonotone = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const EmojioneV1: typeof GeneratedTypes.EmojioneV1 = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Entypo: typeof GeneratedTypes.Entypo = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const EntypoSocial: typeof GeneratedTypes.EntypoSocial = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const EosIcons: typeof GeneratedTypes.EosIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Ep: typeof GeneratedTypes.Ep = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Et: typeof GeneratedTypes.Et = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Eva: typeof GeneratedTypes.Eva = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const F7: typeof GeneratedTypes.F7 = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Fa: typeof GeneratedTypes.Fa = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Fa6Brands: typeof GeneratedTypes.Fa6Brands = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Fa6Regular: typeof GeneratedTypes.Fa6Regular = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Fa6Solid: typeof GeneratedTypes.Fa6Solid = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Fa7Brands: typeof GeneratedTypes.Fa7Brands = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Fa7Regular: typeof GeneratedTypes.Fa7Regular = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Fa7Solid: typeof GeneratedTypes.Fa7Solid = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const FaBrands: typeof GeneratedTypes.FaBrands = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const FaRegular: typeof GeneratedTypes.FaRegular = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const FaSolid: typeof GeneratedTypes.FaSolid = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Fad: typeof GeneratedTypes.Fad = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Famicons: typeof GeneratedTypes.Famicons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Fe: typeof GeneratedTypes.Fe = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Feather: typeof GeneratedTypes.Feather = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const FileIcons: typeof GeneratedTypes.FileIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Flag: typeof GeneratedTypes.Flag = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Flagpack: typeof GeneratedTypes.Flagpack = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const FlatColorIcons: typeof GeneratedTypes.FlatColorIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const FlatUi: typeof GeneratedTypes.FlatUi = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Flowbite: typeof GeneratedTypes.Flowbite = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Fluent: typeof GeneratedTypes.Fluent = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const FluentColor: typeof GeneratedTypes.FluentColor = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const FluentEmoji: typeof GeneratedTypes.FluentEmoji = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const FluentEmojiFlat: typeof GeneratedTypes.FluentEmojiFlat = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const FluentEmojiHighContrast: typeof GeneratedTypes.FluentEmojiHighContrast = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const FluentMdl2: typeof GeneratedTypes.FluentMdl2 = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Fontelico: typeof GeneratedTypes.Fontelico = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Fontisto: typeof GeneratedTypes.Fontisto = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Formkit: typeof GeneratedTypes.Formkit = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Foundation: typeof GeneratedTypes.Foundation = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Fxemoji: typeof GeneratedTypes.Fxemoji = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Gala: typeof GeneratedTypes.Gala = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const GameIcons: typeof GeneratedTypes.GameIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Garden: typeof GeneratedTypes.Garden = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Geo: typeof GeneratedTypes.Geo = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Gg: typeof GeneratedTypes.Gg = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Gis: typeof GeneratedTypes.Gis = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const GravityUi: typeof GeneratedTypes.GravityUi = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Gridicons: typeof GeneratedTypes.Gridicons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const GrommetIcons: typeof GeneratedTypes.GrommetIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Guidance: typeof GeneratedTypes.Guidance = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Healthicons: typeof GeneratedTypes.Healthicons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Heroicons: typeof GeneratedTypes.Heroicons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const HeroiconsOutline: typeof GeneratedTypes.HeroiconsOutline = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const HeroiconsSolid: typeof GeneratedTypes.HeroiconsSolid = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Hugeicons: typeof GeneratedTypes.Hugeicons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Humbleicons: typeof GeneratedTypes.Humbleicons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Ic: typeof GeneratedTypes.Ic = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const IcomoonFree: typeof GeneratedTypes.IcomoonFree = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const IconPark: typeof GeneratedTypes.IconPark = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const IconParkOutline: typeof GeneratedTypes.IconParkOutline = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const IconParkSolid: typeof GeneratedTypes.IconParkSolid = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const IconParkTwotone: typeof GeneratedTypes.IconParkTwotone = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Iconamoon: typeof GeneratedTypes.Iconamoon = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Iconoir: typeof GeneratedTypes.Iconoir = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Icons8: typeof GeneratedTypes.Icons8 = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Il: typeof GeneratedTypes.Il = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Ion: typeof GeneratedTypes.Ion = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Iwwa: typeof GeneratedTypes.Iwwa = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Ix: typeof GeneratedTypes.Ix = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Jam: typeof GeneratedTypes.Jam = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const La: typeof GeneratedTypes.La = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const LetsIcons: typeof GeneratedTypes.LetsIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const LineMd: typeof GeneratedTypes.LineMd = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Lineicons: typeof GeneratedTypes.Lineicons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Logos: typeof GeneratedTypes.Logos = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Ls: typeof GeneratedTypes.Ls = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Lsicon: typeof GeneratedTypes.Lsicon = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Lucide: typeof GeneratedTypes.Lucide = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const LucideLab: typeof GeneratedTypes.LucideLab = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Mage: typeof GeneratedTypes.Mage = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Majesticons: typeof GeneratedTypes.Majesticons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Maki: typeof GeneratedTypes.Maki = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Map: typeof GeneratedTypes.Map = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Marketeq: typeof GeneratedTypes.Marketeq = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const MaterialIconTheme: typeof GeneratedTypes.MaterialIconTheme = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const MaterialSymbols: typeof GeneratedTypes.MaterialSymbols = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const MaterialSymbolsLight: typeof GeneratedTypes.MaterialSymbolsLight = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Mdi: typeof GeneratedTypes.Mdi = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const MdiLight: typeof GeneratedTypes.MdiLight = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const MedicalIcon: typeof GeneratedTypes.MedicalIcon = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Memory: typeof GeneratedTypes.Memory = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Meteocons: typeof GeneratedTypes.Meteocons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const MeteorIcons: typeof GeneratedTypes.MeteorIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Mi: typeof GeneratedTypes.Mi = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Mingcute: typeof GeneratedTypes.Mingcute = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const MonoIcons: typeof GeneratedTypes.MonoIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Mynaui: typeof GeneratedTypes.Mynaui = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Nimbus: typeof GeneratedTypes.Nimbus = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Nonicons: typeof GeneratedTypes.Nonicons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Noto: typeof GeneratedTypes.Noto = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const NotoV1: typeof GeneratedTypes.NotoV1 = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Nrk: typeof GeneratedTypes.Nrk = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Octicon: typeof GeneratedTypes.Octicon = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Oi: typeof GeneratedTypes.Oi = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Ooui: typeof GeneratedTypes.Ooui = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Openmoji: typeof GeneratedTypes.Openmoji = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Oui: typeof GeneratedTypes.Oui = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Pajamas: typeof GeneratedTypes.Pajamas = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Pepicons: typeof GeneratedTypes.Pepicons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const PepiconsPencil: typeof GeneratedTypes.PepiconsPencil = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const PepiconsPop: typeof GeneratedTypes.PepiconsPop = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const PepiconsPrint: typeof GeneratedTypes.PepiconsPrint = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Ph: typeof GeneratedTypes.Ph = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Picon: typeof GeneratedTypes.Picon = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Pixel: typeof GeneratedTypes.Pixel = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Pixelarticons: typeof GeneratedTypes.Pixelarticons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Prime: typeof GeneratedTypes.Prime = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Proicons: typeof GeneratedTypes.Proicons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Ps: typeof GeneratedTypes.Ps = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const QlementineIcons: typeof GeneratedTypes.QlementineIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Quill: typeof GeneratedTypes.Quill = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const RadixIcons: typeof GeneratedTypes.RadixIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Raphael: typeof GeneratedTypes.Raphael = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Ri: typeof GeneratedTypes.Ri = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const RivetIcons: typeof GeneratedTypes.RivetIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Si: typeof GeneratedTypes.Si = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const SiGlyph: typeof GeneratedTypes.SiGlyph = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Sidekickicons: typeof GeneratedTypes.Sidekickicons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const SimpleIcons: typeof GeneratedTypes.SimpleIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const SimpleLineIcons: typeof GeneratedTypes.SimpleLineIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const SkillIcons: typeof GeneratedTypes.SkillIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Solar: typeof GeneratedTypes.Solar = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Stash: typeof GeneratedTypes.Stash = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Streamline: typeof GeneratedTypes.Streamline = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineBlock: typeof GeneratedTypes.StreamlineBlock = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineColor: typeof GeneratedTypes.StreamlineColor = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineCyber: typeof GeneratedTypes.StreamlineCyber = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineCyberColor: typeof GeneratedTypes.StreamlineCyberColor = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineEmojis: typeof GeneratedTypes.StreamlineEmojis = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineFlex: typeof GeneratedTypes.StreamlineFlex = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineFlexColor: typeof GeneratedTypes.StreamlineFlexColor = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineFreehand: typeof GeneratedTypes.StreamlineFreehand = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineFreehandColor: typeof GeneratedTypes.StreamlineFreehandColor = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineGuidance: typeof GeneratedTypes.StreamlineGuidance = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineKameleonColor: typeof GeneratedTypes.StreamlineKameleonColor = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineLogos: typeof GeneratedTypes.StreamlineLogos = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlinePixel: typeof GeneratedTypes.StreamlinePixel = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlinePlump: typeof GeneratedTypes.StreamlinePlump = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlinePlumpColor: typeof GeneratedTypes.StreamlinePlumpColor = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineSharp: typeof GeneratedTypes.StreamlineSharp = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineSharpColor: typeof GeneratedTypes.StreamlineSharpColor = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineStickiesColor: typeof GeneratedTypes.StreamlineStickiesColor = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineUltimate: typeof GeneratedTypes.StreamlineUltimate = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const StreamlineUltimateColor: typeof GeneratedTypes.StreamlineUltimateColor = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Subway: typeof GeneratedTypes.Subway = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const SvgSpinners: typeof GeneratedTypes.SvgSpinners = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const SystemUicons: typeof GeneratedTypes.SystemUicons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Tabler: typeof GeneratedTypes.Tabler = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Tdesign: typeof GeneratedTypes.Tdesign = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Teenyicons: typeof GeneratedTypes.Teenyicons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Token: typeof GeneratedTypes.Token = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const TokenBranded: typeof GeneratedTypes.TokenBranded = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Topcoat: typeof GeneratedTypes.Topcoat = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Twemoji: typeof GeneratedTypes.Twemoji = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Typcn: typeof GeneratedTypes.Typcn = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Uil: typeof GeneratedTypes.Uil = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Uim: typeof GeneratedTypes.Uim = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Uis: typeof GeneratedTypes.Uis = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Uit: typeof GeneratedTypes.Uit = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Uiw: typeof GeneratedTypes.Uiw = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Unjs: typeof GeneratedTypes.Unjs = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Vaadin: typeof GeneratedTypes.Vaadin = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Vs: typeof GeneratedTypes.Vs = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const VscodeIcons: typeof GeneratedTypes.VscodeIcons = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Websymbol: typeof GeneratedTypes.Websymbol = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Weui: typeof GeneratedTypes.Weui = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Whh: typeof GeneratedTypes.Whh = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Wi: typeof GeneratedTypes.Wi = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Wpf: typeof GeneratedTypes.Wpf = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Zmdi: typeof GeneratedTypes.Zmdi = new Proxy({} as any, proxyHandler) as any;
// Use the generated types from the .d.ts file
export const Zondicons: typeof GeneratedTypes.Zondicons = new Proxy({} as any, proxyHandler) as any;