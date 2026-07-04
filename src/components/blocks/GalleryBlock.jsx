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
    <section className="py-4 sm:py-6 space-y-6 font-sans">
      {title && <h2 className="text-xl sm:text-3xl font-extrabold text-center text-white tracking-tight px-2">{title}</h2>}
      
      {(!images || images.length === 0) ? (
        <div className="p-6 sm:p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
          No images added to gallery yet. Add image URLs in block settings.
        </div>
      ) : (
        <div className="relative">
          {/* Mobile Carousel / Desktop Grid */}
          <div
            onScroll={handleScroll}
            className={`flex sm:grid overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory sm:snap-none ${gridColsClass} gap-3 sm:gap-4 pb-3 sm:pb-0 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0`}
          >
            {images.map((imgItem, imgIdx) => {
              const imgUrl = typeof imgItem === "string" ? imgItem : imgItem.url;
              const caption = typeof imgItem === "object" ? imgItem.caption : "";

              return (
                <div
                  key={imgIdx}
                  onClick={() => setSelectedImg(imgUrl)}
                  className="shrink-0 w-[80%] sm:w-auto snap-center group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video shadow-lg cursor-pointer"
                >
                  <img
                    src={imgUrl}
                    alt={caption || "Gallery item"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  {caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-2.5 sm:p-3 text-[11px] font-semibold text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                      {caption}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Carousel Indicators */}
          {images && images.length > 1 && (
            <div className="sm:hidden flex items-center justify-center gap-1.5 pt-2">
              {images.map((_, dotIdx) => (
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
      )}

      {/* Lightbox Modal */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImg(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImg(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
          >
            <HiX className="w-6 h-6" />
          </button>
          <img src={selectedImg} alt="Enlarged gallery view" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-slate-800" />
        </div>
      )}
    </section>
  );
}
