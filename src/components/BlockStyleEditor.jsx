"use client";
import React, { useState } from "react";
import { HiColorSwatch, HiChevronDown, HiChevronUp } from "react-icons/hi";
import {
  COLOR_SCHEME_PRESETS,
  FONT_STYLE_OPTIONS,
  FONT_SIZE_OPTIONS,
  SPACING_OPTIONS,
} from "@/config/styleConfig";

export default function BlockStyleEditor({ style = {}, onChange }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateStyle = (key, val) => {
    onChange({ ...style, [key]: val });
  };

  const handlePresetChange = (e) => {
    const selected = COLOR_SCHEME_PRESETS.find((c) => c.id === e.target.value);
    if (selected) {
      onChange({ ...style, bgColor: selected.bg, textColor: selected.text });
    }
  };

  const matchedPreset = COLOR_SCHEME_PRESETS.find(
    (c) => c.bg === style.bgColor && c.text === style.textColor
  );

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
          {/* Preset Color Schemes Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">
              Preset Color Scheme
            </label>
            <select
              value={matchedPreset ? matchedPreset.id : "custom"}
              onChange={handlePresetChange}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="custom">Custom Color Scheme</option>
              {COLOR_SCHEME_PRESETS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Color Pickers: Text Color and Block Bg in a Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Block Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.bgColor || "#0f172a"}
                  onChange={(e) => updateStyle("bgColor", e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={style.bgColor || ""}
                  onChange={(e) => updateStyle("bgColor", e.target.value)}
                  placeholder="e.g. #0f172a"
                  className="w-full font-mono text-[11px] rounded-xl border border-slate-800 bg-slate-900 py-1.5 px-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Block Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.textColor || "#f8fafc"}
                  onChange={(e) => updateStyle("textColor", e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={style.textColor || ""}
                  onChange={(e) => updateStyle("textColor", e.target.value)}
                  placeholder="e.g. #f8fafc"
                  className="w-full font-mono text-[11px] rounded-xl border border-slate-800 bg-slate-900 py-1.5 px-3 text-white focus:outline-none focus:border-indigo-500"
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
                {FONT_STYLE_OPTIONS.map((f) => (
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
                {FONT_SIZE_OPTIONS.map((s) => (
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
