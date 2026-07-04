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
    <section className="py-4 sm:py-6 space-y-6 font-sans">
      {title && (
        <div className="text-center space-y-2 max-w-2xl mx-auto px-2">
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">{title}</h2>
          {subtitle && <p className="text-slate-400 text-xs sm:text-sm">{subtitle}</p>}
        </div>
      )}

      {/* Mobile Horizontal Carousel / Desktop Grid */}
      <div className="relative">
        <div
          onScroll={handleScroll}
          className="flex sm:grid overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory sm:snap-none sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pb-4 sm:pb-0 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0"
        >
          {(items || []).map((item, itemIdx) => (
            <div
              key={itemIdx}
              className="shrink-0 w-[85%] sm:w-auto snap-center group relative bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 sm:p-6 space-y-3 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 backdrop-blur-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xl sm:text-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  {item.icon || "⚡"}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel Indicators */}
        {items && items.length > 1 && (
          <div className="sm:hidden flex items-center justify-center gap-1.5 pt-2">
            {items.map((_, dotIdx) => (
              <div
                key={dotIdx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlide === dotIdx ? "w-5 bg-indigo-500" : "w-1.5 bg-slate-700"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
