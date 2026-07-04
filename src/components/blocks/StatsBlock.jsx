"use client";
import React from "react";
import { HiTrendingUp, HiUsers, HiLightningBolt, HiGlobeAlt } from "react-icons/hi";

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
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && <p className="mt-4 text-base sm:text-lg text-slate-400">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 text-center hover:border-indigo-500/30 transition-all duration-300 shadow-xl group hover:-translate-y-1"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
              {stat.icon || "📊"}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="mt-2 text-sm font-bold text-slate-200 uppercase tracking-wider">
              {stat.label}
            </div>
            {stat.description && (
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{stat.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
