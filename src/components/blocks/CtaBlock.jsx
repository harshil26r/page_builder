"use client";
import React from "react";
import { HiArrowRight } from "react-icons/hi";

export default function CtaBlock({ data = {} }) {
  const {
    headline = "Ready to launch your vision?",
    description = "Join thousands of creators building high-converting landing pages with Aura Page Builder.",
    buttonText = "Get Started Now",
    buttonLink = "#signup",
    secondaryButtonText = "Watch Demo 🎥",
    secondaryButtonLink = "#demo",
    badge = "LIMITED RELEASE",
    theme = "indigo",
    layout = "split",
  } = data;

  const themeClasses =
    theme === "emerald"
      ? "bg-gradient-to-r from-[#062c22] via-[#064e3b] to-[#080b11] border-emerald-500/30"
      : theme === "sunset"
      ? "bg-gradient-to-r from-[#4c0519] via-[#881337] to-[#080b11] border-rose-500/30"
      : theme === "dark"
      ? "bg-[#0d1322]/90 border-slate-800"
      : "bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#080b11] border-indigo-500/40";

  return (
    <section
      className={`relative overflow-hidden rounded-3xl p-8 sm:p-14 border backdrop-blur-2xl shadow-2xl transition-all my-6 ${themeClasses}`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div
        className={`relative z-10 max-w-5xl mx-auto flex flex-col ${
          layout === "centered"
            ? "items-center text-center space-y-6"
            : "sm:flex-row sm:items-center sm:justify-between gap-8 text-center sm:text-left"
        }`}
      >
        {/* Text Section */}
        <div className="space-y-4 max-w-2xl">
          {badge && (
            <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 text-white border border-white/20 backdrop-blur-xl">
              {badge}
            </span>
          )}
          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight break-words">
            {headline}
          </h3>
          {description && (
            <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 pt-2 sm:pt-0 w-full sm:w-auto">
          {buttonText && (
            <a
              href={buttonLink || "#"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-extrabold rounded-2xl bg-white text-slate-950 hover:bg-slate-100 shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span>{buttonText}</span>
              <HiArrowRight className="text-base" />
            </a>
          )}
          {secondaryButtonText && (
            <a
              href={secondaryButtonLink || "#"}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-xs sm:text-sm font-extrabold rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105 backdrop-blur-xl"
            >
              {secondaryButtonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
