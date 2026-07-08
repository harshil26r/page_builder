// ponytail: centralized dynamic styling configuration
export const FONT_STYLE_MAP = {
  sans: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
  display: "font-extrabold tracking-tight",
};

export const FONT_SIZE_MAP = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

export const SPACING_MAP = {
  compact: "py-4 px-3 space-y-4",
  normal: "py-8 px-4 space-y-8",
  spacious: "py-16 px-6 space-y-12",
  hero: "py-24 px-8 space-y-16",
};

export const PAGE_SPACING_MAP = {
  compact: "space-y-6 py-2",
  normal: "space-y-10 py-4",
  spacious: "space-y-16 py-8",
  hero: "space-y-24 py-12",
};

export const FONT_STYLE_OPTIONS = [
  { id: "sans", label: "Sans-Serif" },
  { id: "serif", label: "Serif" },
  { id: "mono", label: "Monospace" },
  { id: "display", label: "Display Bold" },
];

export const FONT_SIZE_OPTIONS = [
  { id: "sm", label: "Small" },
  { id: "base", label: "Medium" },
  { id: "lg", label: "Large" },
  { id: "xl", label: "Extra Large" },
];

export const SPACING_OPTIONS = [
  { id: "compact", label: "Compact Padding" },
  { id: "normal", label: "Standard Padding" },
  { id: "spacious", label: "Spacious Padding" },
  { id: "hero", label: "Hero Padding" },
];

export const COLOR_SCHEME_PRESETS = [
  { id: "slate", name: "Slate Dark", bg: "#0f172a", text: "#f8fafc" },
  { id: "black", name: "Midnight Black", bg: "#000000", text: "#ffffff" },
  { id: "emerald", name: "Forest Emerald", bg: "#064e3b", text: "#ecfdf5" },
  { id: "crimson", name: "Deep Crimson", bg: "#450a0a", text: "#fef2f2" },
  { id: "ocean", name: "Ocean Deep", bg: "#0c4a6e", text: "#f0f9ff" },
  { id: "white", name: "Clean Light", bg: "#ffffff", text: "#0f172a" },
];
