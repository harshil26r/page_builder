"use client";
import React from "react";

export default function LogoCloudBlock({ data }) {
  const headline = data?.headline || "POWERING INNOVATION AT LEADING COMPANIES";
  const logos = data?.logos || [
    { name: "Vercel", text: "VERCEL" },
    { name: "Stripe", text: "STRIPE" },
    { name: "Linear", text: "LINEAR" },
    { name: "Raycast", text: "RAYCAST" },
    { name: "Supabase", text: "SUPABASE" },
    { name: "Figma", text: "FIGMA" },
  ];

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-6 font-sans">
      <div className="glass-panel rounded-3xl p-8 border border-white/10 shadow-xl space-y-6">
        {headline && (
          <h3 className="text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            {headline}
          </h3>
        )}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {logos.map((logo, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 text-slate-400 hover:text-white font-mono font-extrabold text-sm sm:text-base tracking-widest transition-all duration-300 cursor-pointer select-none px-4 py-2 rounded-2xl hover:bg-slate-900/80 border border-slate-800/60 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <span className="text-indigo-400 text-xs">◆</span>
              <span>{logo.text || logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
