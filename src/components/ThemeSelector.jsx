"use client";
import React from "react";
import {
  HiAdjustments,
  HiColorSwatch,
  HiColorCircle,
  HiSelector,
  HiArrowsExpand,
  HiTemplate,
} from "react-icons/hi";

export const FONT_STYLE_OPTIONS = [
  { id: "sans", label: "Modern Sans-Serif", sample: "Inter / Tailwind Sans", class: "font-sans" },
  { id: "serif", label: "Classic Serif", sample: "Playfair / Georgia", class: "font-serif" },
  { id: "mono", label: "Tech Monospace", sample: "JetBrains / Fira Code", class: "font-mono" },
  { id: "display", label: "Bold Display", sample: "Outfit / Montserrat", class: "font-extrabold tracking-tight" },
];

export const FONT_SIZE_OPTIONS = [
  { id: "sm", label: "Small (Compact)", sample: "14px text" },
  { id: "base", label: "Medium (Standard)", sample: "16px text" },
  { id: "lg", label: "Large (Prominent)", sample: "18px text" },
  { id: "xl", label: "Extra Large (Hero)", sample: "20px text" },
];

export const SPACING_OPTIONS = [
  { id: "compact", label: "Compact Padding", value: "py-8 px-4" },
  { id: "normal", label: "Standard Padding", value: "py-16 px-6" },
  { id: "spacious", label: "Spacious Padding", value: "py-24 px-8" },
  { id: "hero", label: "Maximum Hero Padding", value: "py-32 px-10" },
];

export const COLOR_SWATCHES = [
  { name: "Slate Dark", bg: "#0f172a", text: "#f8fafc" },
  { name: "Pitch Black", bg: "#000000", text: "#ffffff" },
  { name: "Deep Emerald", bg: "#064e3b", text: "#ecfdf5" },
  { name: "Crimson Velvet", bg: "#450a0a", text: "#fef2f2" },
  { name: "Oceanic Abyss", bg: "#0c4a6e", text: "#f0f9ff" },
  { name: "Pure White", bg: "#ffffff", text: "#0f172a" },
];

export default function ThemeSelector({
  bgColor = "#0f172a",
  textColor = "#f8fafc",
  fontStyle = "sans",
  fontSize = "base",
  spacing = "normal",
  customCss = "",
  onChange,
}) {
  return (
    <div className="space-y-8 py-2">
      {/* 1. Background & Text Colors */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <HiColorSwatch className="text-indigo-400 text-base" /> Colors (Background & Text)
        </h3>

        {/* Preset Swatches */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {COLOR_SWATCHES.map((swatch, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange("bgColor", swatch.bg);
                onChange("textColor", swatch.text);
              }}
              className="flex items-center gap-2.5 p-3 rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 transition-all active:scale-[0.97]"
            >
              <span
                className="w-5 h-5 rounded-full border border-slate-700 shrink-0 shadow-sm"
                style={{ backgroundColor: swatch.bg }}
              />
              <div className="text-left truncate">
                <div className="text-xs font-bold text-white truncate">{swatch.name}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-2">
            <label className="block text-xs font-bold text-slate-300">Background Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => onChange("bgColor", e.target.value)}
                className="w-10 h-10 rounded-xl border border-slate-700 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => onChange("bgColor", e.target.value)}
                className="flex-1 font-mono text-xs rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-2">
            <label className="block text-xs font-bold text-slate-300">Text Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={textColor}
                onChange={(e) => onChange("textColor", e.target.value)}
                className="w-10 h-10 rounded-xl border border-slate-700 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => onChange("textColor", e.target.value)}
                className="flex-1 font-mono text-xs rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Font Style & Family */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <HiSelector className="text-indigo-400 text-base" /> Font Family / Style
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FONT_STYLE_OPTIONS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onChange("fontStyle", f.id)}
              className={`p-4 rounded-2xl border text-left transition-all active:scale-[0.97] ${
                fontStyle === f.id
                  ? "border-indigo-500 bg-slate-900 text-white shadow-md ring-2 ring-indigo-500/20"
                  : "border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="font-bold text-xs text-white">{f.label}</div>
              <div className={`text-sm mt-1 text-indigo-300 ${f.class}`}>{f.sample}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Font Size Scale */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <HiAdjustments className="text-indigo-400 text-base" /> Font Size Scale
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FONT_SIZE_OPTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange("fontSize", s.id)}
              className={`p-3 rounded-2xl border text-center transition-all active:scale-[0.97] ${
                fontSize === s.id
                  ? "border-indigo-500 bg-slate-900 text-white font-bold shadow-md ring-2 ring-indigo-500/20"
                  : "border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="text-xs font-bold text-white">{s.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Margin & Spacing */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <HiArrowsExpand className="text-indigo-400 text-base" /> Vertical Padding & Margin Spacing
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SPACING_OPTIONS.map((sp) => (
            <button
              key={sp.id}
              type="button"
              onClick={() => onChange("spacing", sp.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all active:scale-[0.97] ${
                spacing === sp.id
                  ? "border-indigo-500 bg-slate-900 text-white font-bold shadow-md ring-2 ring-indigo-500/20"
                  : "border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="text-xs font-bold text-white">{sp.label}</div>
              <div className="text-[10px] font-mono text-slate-500 mt-0.5">{sp.value}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Custom CSS Injector */}
      <div className="pt-6 border-t border-slate-800 space-y-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <HiTemplate className="text-indigo-400 text-base" /> Custom CSS Rules
        </h3>
        <p className="text-xs text-slate-500">Add custom CSS declarations for advanced overrides.</p>
        <textarea
          rows={3}
          value={customCss}
          onChange={(e) => onChange("customCss", e.target.value)}
          placeholder="/* e.g. .my-custom-class { backdrop-filter: blur(10px); } */"
          className="w-full font-mono text-xs rounded-2xl border border-slate-800 bg-slate-950 py-3 px-4 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner resize-none"
        />
      </div>
    </div>
  );
}
