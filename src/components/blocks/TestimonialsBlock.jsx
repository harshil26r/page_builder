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
    <section className="py-4 sm:py-6 space-y-6 font-sans">
      {title && <h2 className="text-xl sm:text-3xl font-extrabold text-center text-white tracking-tight px-2">{title}</h2>}

      {/* Mobile Horizontal Carousel / Desktop Grid */}
      <div className="relative">
        <div
          onScroll={handleScroll}
          className="flex sm:grid overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory sm:snap-none sm:grid-cols-2 gap-4 sm:gap-6 pb-4 sm:pb-0 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0"
        >
          {(items || []).map((t, tIdx) => (
            <div
              key={tIdx}
              className="shrink-0 w-[85%] sm:w-auto snap-center bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 backdrop-blur-xl shadow-lg hover:border-indigo-500/30 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <HiStar key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">{`"${t.quote || ""}"`}</p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-indigo-500/40 shrink-0" />
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-md shrink-0">
                    {t.name ? t.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{t.name || "Anonymous User"}</div>
                  <div className="text-[11px] text-slate-400 truncate">{t.role || "Creator"}</div>
                </div>
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
