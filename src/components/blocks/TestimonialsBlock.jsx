"use client";
import React, { useState } from "react";
import { HiStar } from "react-icons/hi";

export default function TestimonialsBlock({ data = {} }) {
  const { title = "Loved by creators worldwide", items = [] } = data;
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
    <section className="py-8 sm:py-12 space-y-8 font-sans">
      {title && (
        <h2 className="text-2xl sm:text-4xl font-black text-center text-white tracking-tight px-4 leading-tight">
          {title}
        </h2>
      )}

      {/* Mobile Horizontal Carousel / Desktop Grid */}
      <div className="relative">
        <div
          onScroll={handleScroll}
          className="flex sm:grid overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory sm:snap-none sm:grid-cols-2 gap-6 pb-4 sm:pb-0 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0"
        >
          {(items || []).map((t, tIdx) => (
            <div
              key={tIdx}
              className="shrink-0 w-[85%] sm:w-auto snap-center glass-card rounded-3xl p-6 sm:p-8 space-y-5 flex flex-col justify-between hover:-translate-y-1 transition-all"
            >
              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <HiStar key={i} className="w-4 h-4 fill-current drop-shadow-sm" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed font-normal">
                  {`"${t.quote || ""}"`}
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-800/80">
                {t.avatar ? (
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/50 shrink-0 shadow-md"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0 border border-indigo-400/40">
                    {t.name ? t.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-white truncate">{t.name || "Anonymous User"}</div>
                  <div className="text-xs text-indigo-300 font-medium truncate">{t.role || "Creator"}</div>
                </div>
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
