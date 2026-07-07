"use client";
import React from "react";

export default function StatsBlock({ data }) {
  const title = data?.title || "Proven Impact & Scale";
  const subtitle = data?.subtitle || "Trusted by thousands of creators and organizations globally.";
  const stats = data?.items || [
    { value: "99.9%", label: "Uptime SLA", description: "Global edge network reliability", icon: "⚡" },
    { value: "10M+", label: "Page Views", description: "Monthly requests served lightning fast", icon: "🚀" },
    { value: "50k+", label: "Active Creators", description: "Building & shipping every day", icon: "👥" },
    { value: "< 100ms", label: "Global Latency", description: "Blazing fast edge responses", icon: "🌐" },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
      {title && (
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {title}
          </h2>
          {subtitle && <p className="text-sm sm:text-lg text-slate-300 font-normal">{subtitle}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="glass-card rounded-3xl p-8 text-center hover:-translate-y-1 transition-all duration-300 shadow-xl group space-y-3 relative overflow-hidden"
          >
            <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300 inline-block">
              {stat.icon || "📊"}
            </div>
            <div className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-300 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider">
              {stat.label}
            </div>
            {stat.description && (
              <p className="text-xs text-slate-300 leading-relaxed font-normal">{stat.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
