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
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-y border-slate-800/60 my-6">
      {headline && (
        <h3 className="text-center text-xs font-extrabold uppercase tracking-widest text-slate-500 mb-8">
          {headline}
        </h3>
      )}
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-75 hover:opacity-100 transition-opacity">
        {logos.map((logo, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-slate-400 hover:text-white font-extrabold tracking-widest text-lg font-mono transition-colors cursor-pointer select-none px-3 py-1.5 rounded-xl hover:bg-slate-900/50 border border-transparent hover:border-slate-800"
          >
            <span className="text-indigo-400">❖</span>
            <span>{logo.text || logo.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
