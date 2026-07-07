"use client";
import React from "react";
import { HiSparkles, HiArrowRight } from "react-icons/hi";

export default function HeroBlock({ data = {} }) {
  const {
    title = "Build Breathtaking Pages",
    subtitle = "The ultra-fast, mobile-first page builder for modern creators.",
    ctaText = "Explore Features",
    ctaLink = "#",
    imageUrl = "",
    imageAlign = "right",
  } = data;

  const isBgImage = imageAlign === "background" && imageUrl;

  return (
    <section
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-12 lg:p-16 border border-white/10 shadow-2xl transition-all ${
        isBgImage
          ? "bg-cover bg-center text-white"
          : "bg-gradient-to-b from-[#0d1322] via-[#0f172a] to-[#080b11]"
      }`}
      style={
        isBgImage
          ? {
              backgroundImage: `linear-gradient(to bottom, rgba(8, 11, 17, 0.85), rgba(8, 11, 17, 0.95)), url(${imageUrl})`,
            }
          : {}
      }
    >
      {/* Ambient Radial Backlights */}
      {!isBgImage && (
        <>
          <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div
        className={`relative z-10 max-w-6xl mx-auto flex flex-col ${
          imageUrl && imageAlign !== "background"
            ? imageAlign === "left"
              ? "lg:flex-row-reverse"
              : "lg:flex-row"
            : ""
        } items-center gap-8 sm:gap-12 text-center ${
          imageUrl && imageAlign !== "background" ? "lg:text-left" : "text-center"
        }`}
      >
        {/* Main Text Content */}
        <div className="flex-1 space-y-6 w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold backdrop-blur-xl shadow-inner">
            <HiSparkles className="w-4 h-4 text-indigo-400" />
            <span>Next-Gen Visual Canvas</span>
          </div>

          {title && (
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] break-words">
              <span className="bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
          )}

          {subtitle && (
            <p className="text-sm sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0">
              {subtitle}
            </p>
          )}

          {ctaText && (
            <div
              className={`pt-3 flex flex-col sm:flex-row flex-wrap gap-3 ${
                imageUrl && imageAlign !== "background"
                  ? "justify-center lg:justify-start"
                  : "justify-center"
              }`}
            >
              <a
                href={ctaLink || "#"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-extrabold rounded-2xl text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:brightness-110 shadow-xl shadow-indigo-600/30 transition hover:scale-105 active:scale-95 border border-indigo-400/30"
              >
                <span>{ctaText}</span>
                <HiArrowRight className="text-base" />
              </a>
            </div>
          )}
        </div>

        {/* Hero Card / Image */}
        {imageUrl && imageAlign !== "background" && (
          <div className="flex-1 w-full max-w-full lg:max-w-xl">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-950/80 shadow-2xl backdrop-blur-2xl group">
              <img
                src={imageUrl}
                alt="Hero banner"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 max-h-[360px] sm:max-h-none"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080b11] via-transparent to-transparent opacity-60" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
