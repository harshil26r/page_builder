"use client";
import React, { useState } from "react";

export default function FeaturesBlock({ data = {} }) {
  const { title = "Why Choose Us", subtitle = "Core features engineered for speed", items = [] } = data;
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = (e) => {
    const container = e.target;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.offsetWidth * 0.85;
    if (cardWidth > 0) {
      const index = Math.round(scrollPosition / cardWidth);
      setActiveSlide(index);
    }
  };

  return (
    <section className="py-6 sm:py-10 space-y-8 font-sans">
      {title && (
        <div className="text-center space-y-3 max-w-2xl mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-400 text-xs sm:text-base font-normal">{subtitle}</p>
          )}
        </div>
      )}

      {/* Bento Grid Cards */}
      <div className="relative">
        <div
          onScroll={handleScroll}
          className="flex sm:grid overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory sm:snap-none sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pb-4 sm:pb-0 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0"
        >
          {(items || []).map((item, itemIdx) => (
            <div
              key={itemIdx}
              className="shrink-0 w-[85%] sm:w-auto snap-center group relative glass-card rounded-3xl p-6 sm:p-8 space-y-4 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle top border glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-2xl flex items-center justify-center group-hover:scale-110 group-hover:border-indigo-400 transition-all duration-300 shadow-inner text-indigo-300">
                  {item.icon || "⚡"}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators for Mobile */}
        {items && items.length > 1 && (
          <div className="sm:hidden flex items-center justify-center gap-2 pt-3">
            {items.map((_, dotIdx) => (
              <div
                key={dotIdx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlide === dotIdx ? "w-6 bg-indigo-500" : "w-1.5 bg-slate-800"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
