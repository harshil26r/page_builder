"use client";
import React from "react";
import { HiSparkles } from "react-icons/hi";

export default function HeroBlock({ data = {} }) {
  const {
    title = "Build Breathtaking Pages",
    subtitle = "The ultra-fast, mobile-first page builder for modern creators.",
    ctaText = "Explore Features",
    ctaLink = "#",
    imageUrl = "",
    imageAlign = "right", // "right" | "left" | "background"
    bgTheme = "indigo",
  } = data;

  const isBgImage = imageAlign === "background" && imageUrl;

  return (
    <section
      className={`relative overflow-hidden rounded-3xl p-5 sm:p-10 lg:p-14 border border-indigo-500/20 shadow-2xl transition-all ${
        isBgImage ? "bg-cover bg-center text-white" : "bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950"
      }`}
      style={isBgImage ? { backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url(${imageUrl})` } : {}}
    >
      {/* Background Glows */}
      {!isBgImage && (
        <>
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div
        className={`relative z-10 max-w-6xl mx-auto flex flex-col ${
          imageUrl && imageAlign !== "background"
            ? imageAlign === "left"
              ? "lg:flex-row-reverse"
              : "lg:flex-row"
            : ""
        } items-center gap-6 sm:gap-10 text-center ${imageUrl && imageAlign !== "background" ? "lg:text-left" : "text-center"}`}
      >
        {/* Text Content */}
        <div className="flex-1 space-y-4 sm:space-y-6 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <HiSparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Gen Experience</span>
          </div>

          {title && (
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent break-words">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0">
              {subtitle}
            </p>
          )}

          {ctaText && (
            <div className={`pt-2 flex flex-col sm:flex-row flex-wrap gap-3 ${imageUrl && imageAlign !== "background" ? "justify-center lg:justify-start" : "justify-center"}`}>
              <a
                href={ctaLink || "#"}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 text-xs sm:text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 transition hover:scale-105 active:scale-95 border border-indigo-400/30"
              >
                {ctaText}
              </a>
            </div>
          )}
        </div>

        {/* Hero Image */}
        {imageUrl && imageAlign !== "background" && (
          <div className="flex-1 w-full max-w-full lg:max-w-lg">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
              <img
                src={imageUrl}
                alt="Hero image"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 max-h-[300px] sm:max-h-none"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
