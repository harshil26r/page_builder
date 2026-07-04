"use client";
import React from "react";

export default function CtaBlock({ data = {} }) {
  const {
    headline = "Ready to launch your vision?",
    description = "Join thousands of creators building high-converting landing pages with Rapid Page Builder.",
    buttonText = "Get Started Now",
    buttonLink = "#signup",
    secondaryButtonText = "Watch Demo 🎥",
    secondaryButtonLink = "#demo",
    badge = "SPECIAL OFFER",
    theme = "indigo", // "indigo" | "dark" | "emerald" | "sunset"
    layout = "split", // "split" | "centered"
  } = data;

  const themeClasses =
    theme === "emerald"
      ? "bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 border-emerald-500/30"
      : theme === "sunset"
      ? "bg-gradient-to-r from-rose-950 via-pink-900 to-indigo-950 border-rose-500/30"
      : theme === "dark"
      ? "bg-slate-900/90 border-slate-800"
      : "bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-950 border-indigo-500/30";

  return (
    <section
      className={`relative overflow-hidden rounded-3xl p-5 sm:p-10 border backdrop-blur-xl shadow-2xl transition-all ${themeClasses}`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div
        className={`relative z-10 max-w-5xl mx-auto flex flex-col ${
          layout === "centered" ? "items-center text-center space-y-6" : "sm:flex-row sm:items-center sm:justify-between gap-6 text-center sm:text-left"
        }`}
      >
        {/* Text Section */}
        <div className="space-y-3 max-w-2xl">
          {badge && (
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/10 text-white border border-white/20">
              {badge}
            </span>
          )}
          <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight break-words">
            {headline}
          </h3>
          {description && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 pt-2 sm:pt-0 w-full sm:w-auto">
          {buttonText && (
            <a
              href={buttonLink || "#"}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-xs sm:text-sm font-bold rounded-2xl bg-white text-slate-950 hover:bg-slate-100 shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {buttonText}
            </a>
          )}
          {secondaryButtonText && (
            <a
              href={secondaryButtonLink || "#"}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-xs sm:text-sm font-bold rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all duration-200 hover:scale-105"
            >
              {secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
