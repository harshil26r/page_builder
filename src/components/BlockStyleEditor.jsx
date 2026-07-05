"use client";
import React, { useState } from "react";
import { HiColorSwatch, HiAdjustments, HiChevronDown, HiChevronUp } from "react-icons/hi";

const FONT_STYLES = [
  { id: "sans", label: "Sans-Serif" },
  { id: "serif", label: "Serif" },
  { id: "mono", label: "Monospace" },
  { id: "display", label: "Display Bold" },
];

const FONT_SIZES = [
  { id: "sm", label: "Small" },
  { id: "base", label: "Medium" },
  { id: "lg", label: "Large" },
  { id: "xl", label: "Extra Large" },
];

const SPACING_OPTIONS = [
  { id: "compact", label: "Compact Padding" },
  { id: "normal", label: "Standard Padding" },
  { id: "spacious", label: "Spacious Padding" },
  { id: "hero", label: "Hero Padding" },
];

const QUICK_COLORS = [
  { name: "Default", bg: "", text: "" },
  { name: "Slate", bg: "#0f172a", text: "#f8fafc" },
  { name: "Black", bg: "#000000", text: "#ffffff" },
  { name: "Emerald", bg: "#064e3b", text: "#ecfdf5" },
  { name: "Crimson", bg: "#450a0a", text: "#fef2f2" },
  { name: "Ocean", bg: "#0c4a6e", text: "#f0f9ff" },
  { name: "White", bg: "#ffffff", text: "#0f172a" },
];

export default function BlockStyleEditor({ style = {}, onChange }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateStyle = (key, val) => {
    onChange({ ...style, [key]: val });
  };

  return (
    <div className="border border-slate-800/80 rounded-2xl bg-slate-950/60 overflow-hidden mt-4 text-xs">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 bg-slate-900/60 flex items-center justify-between font-bold text-slate-300 hover:text-white transition"
      >
        <span className="flex items-center gap-2">
          <HiColorSwatch className="text-indigo-400" />
          <span>Block Custom Styling & Spacing</span>
          {(style.bgColor || style.textColor || style.fontStyle || style.spacing) && (
            <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 uppercase">
              Custom Styled
            </span>
          )}
        </span>
        {isExpanded ? <HiChevronUp /> : <HiChevronDown />}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-slate-800/80">
          {/* Quick Swatches */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-2">Preset Color Schemes</label>
            <div className="flex flex-wrap gap-2">
              {QUICK_COLORS.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    updateStyle("bgColor", c.bg);
                    updateStyle("textColor", c.text);
                  }}
                  className="px-2.5 py-1 rounded-xl border border-slate-800 bg-slate-900 text-[11px] font-medium text-slate-300 hover:text-white flex items-center gap-1.5 active:scale-[0.96] transition"
                >
                  {c.bg ? (
                    <span className="w-3 h-3 rounded-full border border-slate-700" style={{ backgroundColor: c.bg }} />
                  ) : (
                    <span className="w-3 h-3 rounded-full border border-slate-700 bg-slate-800" />
                  )}
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Block Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.bgColor || "#0f172a"}
                  onChange={(e) => updateStyle("bgColor", e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={style.bgColor || ""}
                  onChange={(e) => updateStyle("bgColor", e.target.value)}
                  placeholder="e.g. #0f172a"
                  className="flex-1 font-mono text-[11px] rounded-xl border border-slate-800 bg-slate-900 py-1.5 px-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Block Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.textColor || "#f8fafc"}
                  onChange={(e) => updateStyle("textColor", e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={style.textColor || ""}
                  onChange={(e) => updateStyle("textColor", e.target.value)}
                  placeholder="e.g. #f8fafc"
                  className="flex-1 font-mono text-[11px] rounded-xl border border-slate-800 bg-slate-900 py-1.5 px-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Font Style & Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Font Style</label>
              <select
                value={style.fontStyle || ""}
                onChange={(e) => updateStyle("fontStyle", e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">Default (Inherit Page)</option>
                {FONT_STYLES.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Font Size Scale</label>
              <select
                value={style.fontSize || ""}
                onChange={(e) => updateStyle("fontSize", e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">Default (Inherit Page)</option>
                {FONT_SIZES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Padding Spacing */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Vertical Padding / Margin</label>
            <select
              value={style.spacing || ""}
              onChange={(e) => updateStyle("spacing", e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">Default Padding</option>
              {SPACING_OPTIONS.map((sp) => (
                <option key={sp.id} value={sp.id}>{sp.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
