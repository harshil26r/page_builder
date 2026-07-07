"use client";
import React, { useState } from "react";
import { HiX } from "react-icons/hi";

export default function GalleryBlock({ data = {} }) {
  const { title = "Product Showcase", images = [], columns = 3 } = data;
  const [selectedImg, setSelectedImg] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const gridColsClass =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 4
      ? "grid-cols-2 sm:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const handleScroll = (e) => {
    const container = e.target;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.offsetWidth * 0.8;
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

      {(!images || images.length === 0) ? (
        <div className="p-8 text-center glass-panel rounded-3xl border border-slate-800 text-slate-400 text-xs sm:text-sm font-medium">
          No images added to gallery yet. Add image URLs in block settings.
        </div>
      ) : (
        <div className="relative">
          {/* Mobile Carousel / Desktop Grid */}
          <div
            onScroll={handleScroll}
            className={`flex sm:grid overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory sm:snap-none ${gridColsClass} gap-5 sm:gap-6 pb-4 sm:pb-0 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0`}
          >
            {images.map((imgItem, imgIdx) => {
              const imgUrl = typeof imgItem === "string" ? imgItem : imgItem.url;
              const caption = typeof imgItem === "object" ? imgItem.caption : "";

              return (
                <div
                  key={imgIdx}
                  onClick={() => setSelectedImg(imgUrl)}
                  className="shrink-0 w-[80%] sm:w-auto snap-center group relative rounded-3xl overflow-hidden glass-panel aspect-video shadow-xl cursor-pointer border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <img
                    src={imgUrl}
                    alt={caption || "Gallery item"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  {caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#080b11] via-[#080b11]/70 to-transparent p-4 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity truncate">
                      {caption}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Carousel Indicators */}
          {images && images.length > 1 && (
            <div className="sm:hidden flex items-center justify-center gap-2 pt-3">
              {images.map((_, dotIdx) => (
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
      )}

      {/* Lightbox Modal */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-50 bg-[#080b11]/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setSelectedImg(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImg(null)}
            className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-2xl bg-slate-900 border border-slate-800"
          >
            <HiX className="w-6 h-6" />
          </button>
          <img
            src={selectedImg}
            alt="Enlarged view"
            className="max-w-full max-h-[85vh] rounded-3xl shadow-2xl border border-white/10"
          />
        </div>
      )}
    </section>
  );
}
